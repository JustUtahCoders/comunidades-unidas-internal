import React from "react";
import { useCss } from "kremling";

export default function LeadSearchInput(props) {
  const scope = useCss(css);

  const [search, setSearch] = React.useState("");

  return (
    <div className="search-container" {...scope}>
      <form
        autoComplete="new-password"
        onSubmit={() => setSearch("")}
        className="search-form"
      >
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
          placeholder="Search for leads"
        />
        <button type="submit" className="primary">
          Search
        </button>
      </form>
    </div>
  );
}

const css = `
	& .search-container {
		display: flex;
		align-items: center;
		width: 100%;
		min-height: 6rem;
	}

	& .search-input {
		width: 100%;
		margin-right: 1.6rem;
	}

	& .search-form {
		display: flex;
		align-items: center;
		width: 100%;
	}

	& .advanced-search {
		padding: 1.4rem;
	}

	& .advanced-search h1 {
		font-size: 2.4rem;
		margin: 0;
	}

	& .advanced-search .header {
		margin-bottom: 1.6rem;
	}

	& .advanced-search-fields {
		display: grid;
		grid-template-columns: 1fr 3fr;
		align-items: center;
		grid-gap: .8rem;
		margin-bottom: 1.6rem;
	}
`;
