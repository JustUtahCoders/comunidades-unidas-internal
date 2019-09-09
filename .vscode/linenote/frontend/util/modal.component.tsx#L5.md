_Last Updated 9/2/2019 10:41PM_

The `Modal` function is to create a full screen style pop-up (i.e. the functionality takes up the fullscreen even if the visual does not).

`<div className="modal-screen" {...scope} />` is creating the full screen "background" layer that prevents misclicks on other elements.

`<div className="modal-dialog" {...scope}></div>` is the container of the actual dialog box.

```javascript
<div className="modal-header">
  <div>{props.headerText}</div>
  <button className="icon close" onClick={props.close}>
    &times;
  </button>
</div>
```

The above is to create the header. `props.headerText` is what the header title will be.

`props.close` I'm assuming needs to be a custom function passed to change the state that controls it's toggle rather than a reusable handleClose like function. Would the same effect be achievable by having a handleClose function in this component that just the setState part of the useState be passed to it and the target result? Is there an added benifit doing it this way or just a matter of personal preference?

`props.children` ???

`props.tertiaryText/Action`, `props.secondaryText/Action`, and `props.primaryText/Action` are the options for up to 3 buttons?
