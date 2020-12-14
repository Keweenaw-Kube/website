# Migration `20201214011711-initial-migration`

This migration has been generated by Max Isom at 12/13/2020, 8:17:11 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql

```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20201214011711-initial-migration
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,51 @@
+generator client {
+  provider = "prisma-client-js"
+}
+
+datasource db {
+  provider = "postgresql"
+  url = "***"
+}
+
+model Picture {
+  id          Int      @id @default(autoincrement())
+  userId      Int
+  serverId    Int
+  path        String
+  width       Int
+  height      Int
+  caption     String   @default("")
+  isApproved  Boolean  @default(false)
+  createdAt   DateTime @default(now())
+  server      Server   @relation(fields: [serverId], references: [id])
+  user        User     @relation(fields: [userId], references: [id])
+}
+
+model Server {
+  id               Int           @id @default(autoincrement())
+  name             String
+  domain           String
+  description      String
+  limitToMembers   Boolean       @default(true)
+  createdAt        DateTime      @default(now())
+  pictures         Picture[]
+}
+
+model User {
+  id                Int         @id @default(autoincrement())
+  email             String      @unique
+  minecraftUUID     String      @default("")
+  minecraftUsername String      @default("")
+  createdAt         DateTime    @default(now())
+  isMember          Boolean     @default(false)
+  isOfficer         Boolean     @default(false)
+  isBanned          Boolean     @default(false)
+  pictures          Picture[]
+}
+
+model WhitelistToken {
+  id            Int         @id @default(autoincrement())
+  code          String      @default("")
+  minecraftUUID String      @default("")
+  createdAt     DateTime    @default(now())
+}
```

