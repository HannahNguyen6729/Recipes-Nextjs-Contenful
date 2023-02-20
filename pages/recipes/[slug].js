import { createClient } from "contentful";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_KEY,
});

export async function getStaticPaths() {
  const response = await client.getEntries({
    content_type: "recipe",
  });

  const recipes = response.items;
  const paths = recipes.map((recipe) => {
    return {
      params: { slug: recipe.fields.slug },
    };
  });
  //console.log("paths", paths);

  return {
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const { slug } = context.params;
  const recipe = await client.getEntries({
    content_type: "recipe",
    "fields.slug": slug,
  });

  console.log("recipe", recipe.items[0]);

  return {
    // Passed to the page component as props
    props: { recipe: recipe.items[0] },
  };
}

export default function RecipeDetails({ recipe }) {
  // console.log("recipe prop", recipe);
  return <div>Recipe Details</div>;
}
