import {
    registerInjectable,
    registerInjectableObject,
    registerInjectableValue,
    getInjectable,
    getInjectableValue,
    removeInjectable,
    Injectable,
    Inject,
    InjectableExistsException,
    clearInjectables
} from './index';

beforeEach(() => {
    clearInjectables();
});

test('should register injectable class without parameters', () => {
    class TestClass {}
    registerInjectable<TestClass>(TestClass);
    expect(getInjectable(TestClass)).toBeInstanceOf(TestClass);
});

test('should register injectable class with parameters', () => {
    class TestClass {
        constructor(public parameterA: string, public parameterB: number) {}
    }

    const param1 = 'string';
    const param2 = 1337;

    registerInjectable<TestClass>(TestClass, param1, param2);
    const obj = getInjectable<TestClass>(TestClass);

    expect(obj).toBeInstanceOf(TestClass);
    expect(obj!.parameterA).toBe(param1);
    expect(obj!.parameterB).toBe(param2);
});

test('should register injectable class with function parameters', () => {
    class TestClass {
        constructor(public parameterA: string, public parameterB: number) {}
    }

    const param1 = 'string';
    const param2 = 1337;

    registerInjectable<TestClass>(TestClass, () => param1, () => param2);
    const obj = getInjectable<TestClass>(TestClass);

    expect(obj).toBeInstanceOf(TestClass);
    expect(obj!.parameterA).toBe(param1);
    expect(obj!.parameterB).toBe(param2);
});


test('should register object as injectable by class', () => {
    class TestClass {}
    const obj = new TestClass();

    registerInjectableObject<TestClass>(TestClass, obj);
    expect(getInjectable(TestClass)).toBeInstanceOf(TestClass);
});

test('should register values as injectable by key', () => {
    const str = 'string-value';
    const nr = 1337;
    const bol = true;

    registerInjectableValue<string>('string', str);
    registerInjectableValue<number>('number', nr);
    registerInjectableValue<boolean>('boolean', bol);

    expect(getInjectableValue('string')).toBe(str);
    expect(getInjectableValue('number')).toBe(nr);
    expect(getInjectableValue('boolean')).toBe(bol);
});

test('should fail on double registration of same class', () => {
    class TestClass {}
    expect(() => {
        registerInjectable<TestClass>(TestClass);
        registerInjectable<TestClass>(TestClass);
    }).toThrow(InjectableExistsException);
});

test('should fail on double registration of same class for object', () => {
    class TestClass {}
    const obj1 = new TestClass();
    const obj2 = new TestClass();

    expect(() => {
        registerInjectableObject(TestClass, obj1);
        registerInjectableObject(TestClass, obj2);
    }).toThrow(InjectableExistsException);
});

test('should fail on double registration of same key', () => {
    expect(() => {
        registerInjectableValue('key', 'value');
        registerInjectableValue('key', 'value');
    }).toThrow(InjectableExistsException);
});

test('should not fail but return undefined on get unset injectables', () => {
    let value;

    expect(() => {
        value = getInjectable(Date);
    }).not.toThrow();
    expect(value).toBeUndefined();

    expect(() => {
        value = getInjectableValue('unset');
    }).not.toThrow();
    expect(value).toBeUndefined();
});

test('should remove injectable class', () => {
    class TestClass {}
    registerInjectable(TestClass);
    removeInjectable(TestClass);
    expect(getInjectable(TestClass)).toBeUndefined();
});

test('should remove injectable value', () => {
    registerInjectableValue('test', 'value');
    removeInjectable('test');
    expect(getInjectableValue('test')).toBeUndefined();
});


// Decorators tests

test('should inject injectable class', () => {
    @Injectable() class TestClass {}

    class TestClass2 {
        @Inject(TestClass)
        public readonly test: TestClass;
    }

    const obj1 = new TestClass2();
    expect(obj1.test).toBeInstanceOf(TestClass);
});

test('injected should be singleton', () => {
    @Injectable() class TestClass {}

    class TestClass2 {
        @Inject(TestClass)
        public readonly test: TestClass;
    }

    const obj1 = new TestClass2();
    const obj2 = new TestClass2();
    expect(obj1.test).toBe(obj2.test);
});

test('should inject injectable class with parameters', () => {
    const param1 = 'string';
    const param2 = 1337;
    @Injectable(param1, param2) class TestClass {
        constructor(public parameterA: string, public parameterB: number) {}
    }

    class TestClass2 {
        @Inject(TestClass)
        public readonly test: TestClass;
    }

    const obj1 = new TestClass2();
    expect(obj1.test).toBeInstanceOf(TestClass);
    expect(obj1.test.parameterA).toBe(param1);
    expect(obj1.test.parameterB).toBe(param2);
});

test('should inject registered injectable object', () => {
    class TestClass {}
    const obj = new TestClass();

    registerInjectableObject(TestClass, obj);

    class TestClass2 {
        @Inject(TestClass)
        public readonly test: TestClass;
    }
    const obj1 = new TestClass2();

    expect(obj1.test).toBe(obj);
    expect(obj1.test).toBeInstanceOf(TestClass);
});

test('should inject registered values', () => {
    const str = 'string-value';
    const nr = 1337;
    const bol = true;

    registerInjectableValue('string', str);
    registerInjectableValue('number', nr);
    registerInjectableValue('boolean', bol);

    class TestClass2 {
        @Inject('string')
        public readonly testString: string;

        @Inject('number')
        public readonly testNumber: number;

        @Inject('boolean')
        public readonly testBoolean: boolean;
    }
    const obj1 = new TestClass2();

    expect(obj1.testString).toBe(str);
    expect(obj1.testNumber).toBe(nr);
    expect(obj1.testBoolean).toBe(bol);
});

test('should inject writeable value', () => {
    const value1 = 'string-value';
    const value2 = 'new-string-value';
    registerInjectableValue('key', value1);

    class TestClass2 {
        @Inject('key', true)
        public testString: string;
    }
    const obj1 = new TestClass2();
    obj1.testString = value2;
    const obj2 = new TestClass2();

    expect(obj1.testString).toBe(value2);
    expect(obj2.testString).toBe(value1);
});
