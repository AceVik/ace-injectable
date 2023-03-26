## @ace/injectable
> @ace/injectable is a typescript decorators package to mark
> things as injectable and inject them into class properties.
> 
> It uses singleton pattern von injectable classes.

# How to use
First, install the package:

```bash
npm install @ace/injectable
yarn add @ace/injectable
pnpm add @ace/injectable
```

## Define a class as injectable
Define the first **Injectable**, by using the `Injectable` decorator:

<!--TypeScript-->
```ts
import { Injectable } from '@ace/injectable';

@Injectable()
export class MyService {
    public printExample() {
        console.log('example');
    }
}
```

## Inject a singleton of `MyService`
Use the `Inject` decorator to inject a `MyService` singleton as a property.

<!--TypeScript-->
```ts
import { Inject } from '@ace/injectable';
import { MyService } from './my-service';

class MyClass {
    @Inject(MyService)
    public readonly myService: MyService;
}
```

## Use the injected service
<!--TypeScript-->
```ts
const obj = new MyClass();
obj.myService.printExample(); // => example
```

## Conclusion
> This package can some more stuff, just look for it in `src/index.test.ts`
