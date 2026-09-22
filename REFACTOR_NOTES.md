# Refactor Notes

## Scope

This revision packages the local Streamlit host, plugin server, embedded plugin UI, and web app as a clean source repository while preserving the existing API routes.

## Changes

- Fixed the plugin-server billing action type for creator companion generation.
- Moved long-running generation job types into the shared plugin contract.
- Fixed host/plugin busy-state compatibility for creator jobs.
- Extracted reusable email normalization and validation helpers.
- Fixed guest-upgrade compilation and registration routing.
- Made production API discovery same-origin by default to avoid HTTPS mixed-content failures.
- Removed hard-coded Supabase and plugin tokens from tracked source.
- Added configuration templates for Streamlit, the web app, and the plugin server.
- Replaced shell-based Node startup with an explicit executable invocation.
- Excluded secrets, private keys, generated builds, local models, videos, virtual environments, and dependency directories from Git.

## API compatibility

No API route was removed. Providers that are not configured continue to use the existing error or mock-provider paths. Future provider replacements should preserve URLs, HTTP methods, request fields, and successful response fields.

## Verification

- `plugin-server`: TypeScript build passes.
- `plugin-ui`: TypeScript and both Vite builds pass.
- `web-app`: TypeScript project build and Vite production build pass.
- `soulmirror_app.py`: Python bytecode compilation passes.

The frontend builds still report large-chunk warnings for the main app and model-viewer. Code splitting remains a follow-up optimization.
