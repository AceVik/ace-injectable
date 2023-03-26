const injectables: Map< { new(): unknown } | (string | number | boolean), ReadonlyArray<any> | null | undefined | any> = new Map();

type Constructor<T = unknown> = new (...args: any[]) => T;
type InjectableArg<T> = T | (() => T);

export class InjectableExistsException extends Error {}

function failOnExists(key: { new(): unknown } | (string | number | boolean)) {
    if (injectables.has(key)) {
        throw new InjectableExistsException(
            key instanceof Function ?
                'injectable already registered' :
                'injectable value "' + key + '" is registered'
        );
    }
}

export function registerInjectable<T, TParams extends any[] = ConstructorParameters<Constructor<T>>>(
    injectableType: Constructor<T>,
    ...injectableParams: { [K in keyof TParams]: InjectableArg<TParams[K]> }
): void {
    failOnExists(injectableType);
    injectables.set(injectableType, injectableParams);
}

export function registerInjectableValue<T extends (string | number | boolean)>(key: string, value: T): void {
    failOnExists(key);
    injectables.set(key, value);
}
export function registerInjectableObject<T>(injectableType: Constructor<T>, object: T): void {
    failOnExists(injectableType);
    injectables.set(injectableType, object);
}


const valuesTypes = ['string', 'number', 'boolean'];
export function getInjectable<T>(injectableType: Constructor<T>): T | undefined {
    if (!injectables.has(injectableType)) {
        return undefined;
    }

    let singleton = injectables.get(injectableType);

    if (valuesTypes.includes(typeof singleton)) {
        return undefined;
    }

    if (Array.isArray(singleton)) {
        const params = singleton.map((x) => typeof x === 'function' ? x() : x);
        singleton = new (injectableType as any)(...params);
        injectables.set(injectableType, singleton);
    } else if (!singleton) {
        singleton = new injectableType();
        injectables.set(injectableType, singleton);
    }

    return singleton;
}
export function getInjectableValue<T extends (string | number | boolean)>(key: string): T | undefined {
    if (!injectables.has(key)) {
        return undefined;
    }

    const singleton = injectables.get(key);

    if (!valuesTypes.includes(typeof singleton)) {
        return undefined;
    }

    return singleton;
}

export function removeInjectable(key: string): void
export function removeInjectable(injectableType: { new(): unknown }): void
export function removeInjectable(injectableTypeOrKey: { new(): unknown } | string): void {
    injectables.delete(injectableTypeOrKey);
}

export function clearInjectables(): void {
    injectables.clear();
}

// Decorators
export function Injectable<T, TParams extends any[] = ConstructorParameters<Constructor<T>>>(
    ...injectableParams: { [K in keyof TParams]: InjectableArg<TParams[K]> }
) {
    return (injectableType: Constructor<T>) => {
        registerInjectable<T>(injectableType, ...injectableParams);
    };
}

export function Inject(key: string, writable?: boolean): PropertyDecorator;
export function Inject(injectableType: Constructor<unknown>): PropertyDecorator;
export function Inject(injectableTypeOrKey: Constructor<unknown> | string, writable?: boolean): PropertyDecorator {
    return (target, parameterName) => {
        Object.defineProperty(target, parameterName, {
            value: typeof injectableTypeOrKey === 'string' ?
                getInjectableValue(injectableTypeOrKey) :
                getInjectable(injectableTypeOrKey),
            writable: !!writable,
        });
    };
}
