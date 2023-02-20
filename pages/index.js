import { createClient } from "contentful";
import RecipeCard from "../components/RecipeCard";

export default function Recipes({ recipes }) {
  console.log(recipes);
  return (
    <div className="recipe-list">
      {recipes.map((recipe) => {
        return <RecipeCard key={recipe.sys.id} recipe={recipe} />;
      })}

      <style jsx>
        {`
      .recipe-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          grid-gap: 2rem;
      `}
      </style>
    </div>
  );
}

export const getStaticProps = async () => {
  const client = createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: process.env.CONTENTFUL_SPACE_ID,
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  });
  const response = await client.getEntries({
    content_type: "recipe",
  });

  //console.log(response);
  // console.log(response.items);

  return {
    props: {
      recipes: response.items,
    },
  };
};
