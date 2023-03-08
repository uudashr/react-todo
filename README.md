# React Todo App

Simple React Todo Application

## Reference Documentation
1. [Jest Documentation](https://jestjs.io/docs/getting-started)
2. [Testing Library Documentation](https://testing-library.com/docs/)
3. [How to fetch data with React Hooks](https://www.robinwieruch.de/react-hooks-fetch-data/)
4. [Make Create-React-App Faster with Rust](https://jwchang0206.medium.com/make-create-react-app-faster-with-rust-6c75ffa8fdfd)

## Testing
### jsdom
In order to jsdom to works, se need to mock the `matchMedia`. Need to add script on `setupTests.js`
```javascript
Object.defineProperty(window, 'matchMedia', {
  value: () => {
    return {
      matches: false,
      addListener: () => { },
      removeListener: () => { }
    };
  }
});
```

### Ant Design
Add below to `package.json` tp ensure the antd can works with testing.
```json
{
  "jest": {
    "transformIgnorePatterns": [
      "/node_modules/(?!antd|@ant-design|rc-.+?|@babel/runtime).+(js|jsx)$"
    ],
  }
}
```

### Mock
Add below to `package.json` to ensure the test Jest mock / `jest.fn()` can works

```json
{
  "jest": {
    "resetMocks": false
  }
}
```

Ref: https://github.com/facebook/jest/issues/9131