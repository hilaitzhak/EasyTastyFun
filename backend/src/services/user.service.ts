import mongoose from "mongoose";
import User from "../models/user.model";
import Recipe from "../models/recipe.model";

export class UserService {
    constructor() {}

    // The JWT payload stores the user identifier under `userId`. Depending on how
    // the token was issued this may be the custom UUID `id` field or Mongo's _id,
    // so try both to be safe.
    private async getUser(userId: string) {
        // Tokens carry the stable Mongo _id, but fall back to the custom `id`
        // field for any older tokens that may still be around.
        let user = mongoose.isValidObjectId(userId) ? await User.findById(userId) : null;
        if (!user) {
            user = await User.findOne({ id: userId });
        }
        if (!user) throw new Error("User not found");
        return user;
    }

    async getFavoriteIds(userId: string): Promise<string[]> {
        const user = await this.getUser(userId);
        return (user.get("favorites") as string[]) || [];
    }

    // Returns the full recipe documents for the user's favorites.
    async getFavorites(userId: string) {
        const favorites = await this.getFavoriteIds(userId);
        if (favorites.length === 0) return [];
        const recipes = await Recipe.find({ recipeId: { $in: favorites } });
        // Preserve the order in which recipes were favorited.
        const byId = new Map(recipes.map((r) => [r.get("recipeId"), r]));
        return favorites.map((rid) => byId.get(rid)).filter(Boolean);
    }

    async addFavorite(userId: string, recipeId: string): Promise<string[]> {
        const user = await this.getUser(userId);
        const favorites = (user.get("favorites") as string[]) || [];
        if (!favorites.includes(recipeId)) {
            favorites.push(recipeId);
            user.set("favorites", favorites);
            await user.save();
        }
        return favorites;
    }

    async removeFavorite(userId: string, recipeId: string): Promise<string[]> {
        const user = await this.getUser(userId);
        const favorites = ((user.get("favorites") as string[]) || []).filter((id) => id !== recipeId);
        user.set("favorites", favorites);
        await user.save();
        return favorites;
    }
}
