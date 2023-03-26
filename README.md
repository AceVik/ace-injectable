## @ace-pkg/injectable
> @ace-pkg/injectable is a typescript decorators package to mark
> things as injectable and inject them into class properties.
> 
> It uses singleton pattern von injectable classes.

# How to use
First, install the package:

```bash
npm install @ace-pkg/injectable
yarn add @ace-pkg/injectable
pnpm add @ace-pkg/injectable
```

## Define a class as injectable
Define the first **Injectable**, by using the `Injectable` decorator:

<!--TypeScript-->

```ts
import { Injectable } from '@ace-pkg/injectable';

@Injectable('service')
export class MyService {
    constructor(private message: string) {}

    public printExample() {
        console.log('example-' + this.message);
    }
}
```

## Inject a singleton of `MyService`
Use the `Inject` decorator to inject a `MyService` singleton as a property.

<!--TypeScript-->
```ts
import { Inject } from '@ace-pkg/injectable';
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
obj.myService.printExample(); // => example-service
```

## Conclusion
> This package can some more stuff, just look for it in `src/index.test.ts`
