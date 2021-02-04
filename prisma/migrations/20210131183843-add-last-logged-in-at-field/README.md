# Migration `20210131183843-add-last-logged-in-at-field`

This migration has been generated by Max Isom at 1/31/2021, 12:38:43 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."User" ADD COLUMN "lastLoggedInAt" timestamp(3)   DEFAULT CURRENT_TIMESTAMP
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201215013222-add-auth-token..20210131183843-add-last-logged-in-at-field
--- datamodel.dml
+++ datamodel.dml
@@ -3,9 +3,9 @@
 }
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 model Picture {
   id          Int      @id @default(autoincrement())
@@ -35,8 +35,9 @@
   id                Int         @id @default(autoincrement())
   email             String      @unique
   minecraftUUID     String      @default("")
   minecraftUsername String      @default("")
+  lastLoggedInAt    DateTime?   @default(now())
   createdAt         DateTime    @default(now())
   isMember          Boolean     @default(false)
   isOfficer         Boolean     @default(false)
   isBanned          Boolean     @default(false)
```

