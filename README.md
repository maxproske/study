# study

# Setup

1. Copy the sample env file.

```bash
cp .env.sample .env
```

2. Get your token from https://toggl.com/app/profile


3. Run the site.

```bash
./debug.sh
```

## Info

- [Standard Request Parameters](https://github.com/toggl/toggl_api_docs/blob/master/reports.md#request-parameters)
- [Reports API v2 Docs](https://github.com/toggl/toggl_api_docs/blob/master/reports/detailed.md)
- [Reports API v3 Examples](https://github.com/AlessioCoser/report/blob/94d5c0ba5e9da48e3b30da22c47422384158c398/action.js)

The Toggl API is divided into two, Toggl API and Reports API. For time entries, you'll need to use the Reports API.

## Gotchas

Why not use https://toggl.com/api/v9/me/time_entries?
- `since` and `start_date` cannot be older than 3 months.