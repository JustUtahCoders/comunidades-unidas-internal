# QUESTIONS LOG

## 9/2/2019

---

### frontend/util/easy-fetch.ts > _easyFetch_

- I'm a little fuzzy on what all is going on in the `return` part of this function

---

### frontend/client-search/client-list/client-search-dsl.helpers.tsx > _SearchParseValues_

- I follow that this is setting the types for `name`, `zip`, `phone`, and `id`, but I do not follow the overall purpose.
  _ Is this creating a reusable type model?
  _ Or is it a profile for the query-string to follow and then reuse? \* _(Also I know "profile" isn't really the correct term but I can't for the life of me remember what the term really is)_

---

### frontend/util/modal.component.tsx > _Modal_

- `props.close` I'm assuming needs to be a custom function passed to change the state that controls it's toggle rather than a reusable handleClose like function. Would the same effect be achievable by having a handleClose function in this component that just the setState part of the useState be passed to it and the target result? Is there an added benifit doing it this way or just a matter of personal preference?

- `props.children` ???

- `props.tertiaryText/Action`, `props.secondaryText/Action`, and `props.primaryText/Action` are the options for up to 3 buttons?

---

### use-is-mobile.hook.tsx > useEffect()

- What does the `"resize"` param do here? My searches just kept getting me explainations of the `addEventListener()` which was the part I was already following.
