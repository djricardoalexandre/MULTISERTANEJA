/*
# Create moderated listener messages

1. New Tables
- `listener_messages`
- `id` (uuid, primary key): unique submission identifier.
- `nickname` (text, nullable): optional public name or nickname.
- `city` (text): listener city.
- `region` (text): state, province, or region.
- `country` (text): listener country.
- `message` (text, nullable): optional message to the station.
- `allow_publication` (boolean): whether the listener allows publication after moderation.
- `status` (text): moderation state, always `pending` for public submissions.
- `created_at` (timestamptz): submission timestamp.

2. Security
- Enable Row Level Security.
- Allow anonymous and authenticated visitors to submit pending messages.
- Do not expose submitted messages to the public client.
- Block public updates and deletes; moderation can be performed by a privileged operator later.

3. Important Notes
- No sign-in is required for this radio experience.
- The table intentionally stores submissions for moderation instead of publishing them automatically.
- Input length limits protect the public form from oversized submissions.
*/

CREATE TABLE IF NOT EXISTS public.listener_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname text,
  city text NOT NULL CHECK (char_length(city) BETWEEN 1 AND 80),
  region text NOT NULL CHECK (char_length(region) BETWEEN 1 AND 80),
  country text NOT NULL CHECK (char_length(country) BETWEEN 1 AND 80),
  message text CHECK (message IS NULL OR char_length(message) <= 500),
  allow_publication boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending' CHECK (status = 'pending'),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.listener_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Visitors can submit listener messages" ON public.listener_messages;
CREATE POLICY "Visitors can submit listener messages"
  ON public.listener_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending');

DROP POLICY IF EXISTS "Visitors cannot read listener messages" ON public.listener_messages;
CREATE POLICY "Visitors cannot read listener messages"
  ON public.listener_messages FOR SELECT
  TO anon, authenticated
  USING (false);

DROP POLICY IF EXISTS "Visitors cannot update listener messages" ON public.listener_messages;
CREATE POLICY "Visitors cannot update listener messages"
  ON public.listener_messages FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "Visitors cannot delete listener messages" ON public.listener_messages;
CREATE POLICY "Visitors cannot delete listener messages"
  ON public.listener_messages FOR DELETE
  TO anon, authenticated
  USING (false);
