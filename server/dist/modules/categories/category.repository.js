import { db } from "../../db";
import { eq } from "drizzle-orm";
import { categoriesTable } from "../../db/schema";
export const findAll = async () => {
    return await db.query.categoriesTable.findMany();
};
export const findById = async (categoryId) => {
    return await db.query.categoriesTable.findFirst({
        where: eq(categoriesTable.id, categoryId)
    });
};
export const create = async (categoryData) => {
    const [newCategory] = await db.insert(categoriesTable).values({
        name: categoryData.name,
        weight: categoryData.weight.toString(),
        icon: categoryData.icon,
        thumbnail: categoryData.thumbnail
    }).returning();
    return newCategory;
};
export const update = async (categoryId, categoryData) => {
    const [updatedCategory] = await db.update(categoriesTable).set({
        name: categoryData.name,
        weight: categoryData.weight.toString(),
        icon: categoryData.icon,
        thumbnail: categoryData.thumbnail
    }).where(eq(categoriesTable.id, categoryId)).returning();
    return updatedCategory;
};
export const remove = async (categoryId) => {
    const [deletedCategory] = await db.delete(categoriesTable).where(eq(categoriesTable.id, categoryId)).returning();
    return deletedCategory;
};
export default { findAll, findById, create, update, remove };
//# sourceMappingURL=category.repository.js.map