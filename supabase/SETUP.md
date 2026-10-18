# Supabase account setup

1. Create a Supabase project and open its SQL Editor.
2. Run [`schema.sql`](./schema.sql).
3. In **Authentication → URL Configuration**, set the production site URL and add the site's `/account.html` URL to the allowed redirect URLs.
4. Copy the project URL and public anon/publishable key into `assets/supabase-config.js`. Never put a service-role key in frontend code.
5. In **Authentication → Providers**, enable email/password sign-in and configure email confirmation. Set up production SMTP so account confirmation and password-reset emails can be delivered.
6. In **Authentication → Notifications**, enable the password-changed notification if users should receive an email after changing their password. Keep email-change confirmation enabled so Supabase sends confirmation messages to the affected addresses.
7. Test account creation, email confirmation, sign-in (including blank and incorrect credentials), password recovery, profile edits, email-change confirmation, password-change notifications, global sign-out, and TOTP enrollment with a test account.

The account screen is intentionally disabled until the project URL and public key are configured.

The sign-in username is the registered email address. “Forgot username?” explains this; “Forgot password?” sends Supabase's password-reset email. Personal profile details are stored in the protected `profiles` table and account email/password are managed by Supabase Auth. Never write raw passwords to a project file or send them by email; Supabase stores password hashes. Email confirmations and password-change notifications require the project email/notification settings above.

All lessons and study resources are currently available without signing in. The client-side access checks do not restrict lesson navigation or study-resource tabs.

The `lesson_content` read policy allows both anonymous and authenticated visitors to read every row. If you already ran an earlier version of `schema.sql`, rerun the updated SQL in the Supabase SQL Editor to replace the former sample-only policy. This makes content in that table public by design.

## Important content-protection status

Existing lesson pages and data scripts are shipped as public GitHub Pages assets, and current lesson renderers read those local files. The `lesson_content` table is also publicly readable under the current policy. Therefore, neither the schema nor the sign-in screen provides private course content. Do not treat the current deployment as an access-control boundary.
