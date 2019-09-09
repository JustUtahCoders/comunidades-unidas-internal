_last updated 9/3/2019 5:33PM_

I am getting the following errors when the box is checked:

```shell
	Uncaught TypeError: Cannot read desktop-clients-table.component.tsx:142 Uncaught TypeError: Cannot read property 'checked' of null
		at checkTdClicked (desktop-clients-table.component.tsx:142)
		at HTMLUnknownElement.callCallback (react-dom.development.js:347)
		at Object.invokeGuardedCallbackDev (react-dom.development.js:397)
		at invokeGuardedCallback (react-dom.development.js:454)
		at invokeGuardedCallbackAndCatchFirstError (react-dom.development.js:468)
		at executeDispatch (react-dom.development.js:600)
		at executeDispatchesInOrder (react-dom.development.js:622)
		at executeDispatchesAndRelease (react-dom.development.js:725)
		at executeDispatchesAndReleaseTopLevel (react-dom.development.js:733)
		at Array.forEach (<anonymous>)
```

```shell
	Uncaught Error: A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://fb.me/react-crossorigin-error for more information.
		at Object.invokeGuardedCallbackDev (react-dom.development.js:408)
		at invokeGuardedCallback (react-dom.development.js:454)
		at invokeGuardedCallbackAndCatchFirstError (react-dom.development.js:468)
		at executeDispatch (react-dom.development.js:600)
		at executeDispatchesInOrder (react-dom.development.js:622)
		at executeDispatchesAndRelease (react-dom.development.js:725)
		at executeDispatchesAndReleaseTopLevel (react-dom.development.js:733)
		at Array.forEach (<anonymous>)
		at forEachAccumulated (react-dom.development.js:705)
		at runEventsInBatch (react-dom.development.js:750)
```
