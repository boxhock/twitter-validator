class App {
  private _test: string;

  get test(): string {
    return this._test;
  }

  set test(value: string) {
    this._test = value;
  }
}

const app = new App();
export default app;
