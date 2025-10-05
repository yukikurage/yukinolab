import { createPostHandler, createDeleteHandler } from "@/lib/cms/api-factory";

// POST /api/admin/content/[category]/[id] - 作成・更新
export const POST = createPostHandler();

// DELETE /api/admin/content/[category]/[id] - 削除
export const DELETE = createDeleteHandler();
