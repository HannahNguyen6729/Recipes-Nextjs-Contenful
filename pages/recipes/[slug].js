import { createClient } from "contentful";
import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

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
    fallback: true,
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
    props: {
      recipe: recipe.items[0],
    },
    revalidate: 5,
  };
}

export default function RecipeDetails({ recipe }) {
  if (!recipe) {
    return <p>loading...</p>;
  }
  console.log("recipe prop", recipe);
  const { title, ingredients, method, featured, cookingTime } = recipe.fields;
  return (
    <div>
      <div className="banner">
        <Image
          src={`https:${featured.fields.file.url}`}
          width={featured.fields.file.details.image.width}
          height={featured.fields.file.details.image.height}
          alt={title}
        />
        <h2>{title}</h2>
      </div>

      <div className="info">
        <p>Take about {cookingTime} mins to cook</p>
        <h3>Ingredients:</h3>
        {ingredients.map((ingredient) => (
          <span key={ingredient}> {ingredient} </span>
        ))}
      </div>

      <div className="method">{documentToReactComponents(method)}</div>

      <style jsx>{`
        h2,
        h3 {
          text-transform: uppercase;
        }
        .banner h2 {
          margin: 0;
          background: #fff;
          display: inline-block;
          padding: 20px;
          position: relative;
          top: -60px;
          left: -10px;
          transform: rotateZ(-1deg);
          box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.1);
        }
        .info p {
          margin: 0;
        }
        .info span::after {
          content: ", ";
        }
        .info span:last-child::after {
          content: ".";
        }
      `}</style>
    </div>
  );
}
