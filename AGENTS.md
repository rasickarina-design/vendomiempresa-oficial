<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Track automatic and admin-triggered match emails in `public.match_email_notifications` so admin exports can show whether each match email was sent; this keeps email status auditable beyond the email provider's short visible log window.
- Store a user's registered country on `public.profiles.country` and the buyer's target search country on `public.buyers.country`; this lets buyers search in countries different from where they are registered.
- `isMatch` requires country AND city to match (empty on either side does not block; city comparison allows containment); `findNearMatches` applies the same country/city filters.
- AI copywriting (company description) runs in an authenticated createServerFn calling Lovable AI Gateway Responses; keeps the API key and prompt server-side.
