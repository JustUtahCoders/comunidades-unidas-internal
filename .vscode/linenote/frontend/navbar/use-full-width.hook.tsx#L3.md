\*last updated 9/1/2019 11:30PM

`React.useEffect(() => {}, [])` is mimicking a componentDidMount and componentDidUnmount by using an empty set to cause the effect to only run on mount and unmount.

On mount it is identifying the DOM element with the className `"main-content"` using `document.querySelector()`, and then adding the className `"full"`
