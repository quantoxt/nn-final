## Get the project ID from your supabase db settings
## RUN this command in terminal (Replace the "abcdefghijklmnopqrst" with your project id)

supabase gen types typescript --project-id oprghyjjqfvtbdxxzyqn > app/types/database.types.ts

## Initialize a supabase db and get the keys for nuxt framework
### place the keys in the .env file (DO NOT CHANGE THE VARIABLE NAMES)