import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let key = process.env.GOOGLE_API_KEY;

app.post("/places/textsearch", async (req, res) => {
  const { query = "nigeria", language = "en", radius = 2000 } = req.body;


  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${
    query + " point of interest"
  }&language=${language}&radius=${radius}&key=${key}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const structuredData = await Promise.all(
      data?.results?.map(async (attraction, i) => {
        const fetchReviews = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?placeid=${attraction.place_id}&key=${key}`
        );
        const reviewsData = await fetchReviews.json();

        return {
          attraction_images: reviewsData?.result?.photos?.map(
            (photo, i) =>
              `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${key}`
          ),
          weekday_text: reviewsData?.result?.current_opening_hours,
          business_status: attraction?.business_status,
          attraction_address: attraction?.formatted_address,
          attraction_name: attraction?.name,
          plus_code: attraction?.plus_code,
          ratings: attraction?.rating,
          reference: attraction?.reference,
          attraction_types: attraction?.types,
          user_ratings_total: attraction?.user_ratings_total,
          geometry: attraction?.geometry,
          viewport: attraction?.viewport,
          southwest: attraction?.southwest,
          international_phone_number:
          reviewsData?.result?.international_phone_number,
          user_reviews: reviewsData?.result?.reviews,
          editorial_summary: reviewsData?.result?.editorial_summary
        };
      })
    );

    // res.json(data);
    res.json(structuredData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/places/autocomplete", async (req, res) => {
  //   const { query, language, radius, key } = req.body;

  const { input, language, radius } = {
    query: "dubai point of interest",
    language: "en",
    radius: "2000",
    // key: "AIzaSyBXF6yfKy3K0BKjgF836owacxQj76nFfys",
    // key: "AIzaSyB3jDkad-0Rk7QSmaSQHrVKcjR5bJHgkk4",
  };

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=${types}&location=${location}&radius=${radius}&key=${key}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/", (req, res) => {
  res.send({
    welcome: "yo",
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
