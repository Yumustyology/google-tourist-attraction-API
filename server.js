import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
dotenv.config();

let key = process.env.NODE_GOOGLE_API_KEY;

app.post("/places/tourist_attraction", async (req, res) => {
  const {
    language = "en",
    radius = 2000,
    lng = -73.58781,
    lat = 45.50884,
  } = req.body;

  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json
?location=${lat}%2C${lng}
&query=points%20of%20attraction
&language=${language}
&radius=${radius}
&key=${key}`;
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
          editorial_summary: reviewsData?.result?.editorial_summary,
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
          website: reviewsData?.result?.website,
          vicinity: reviewsData?.result?.vicinity,
          attraction_images: reviewsData?.result?.photos?.map(
            (photo, i) =>
              `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${key}`
          ),
        };
      })
    );

    res.json(structuredData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/places/type_search", async (req, res) => {
  const {
    language = "en",
    radius = 2000,
    lng = -73.58781,
    lat = 45.50884,
    type = "restaurant",
  } = req.body;

  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json
?location=${lat}%2C${lng}
&language=${language}
&types=${type}
&radius=${radius}
&key=${key}`;
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
          editorial_summary: reviewsData?.result?.editorial_summary,
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
          website: reviewsData?.result?.website,
          vicinity: reviewsData?.result?.vicinity,
          attraction_images: reviewsData?.result?.photos?.map(
            (photo, i) =>
              `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${key}`
          ),
        };
      })
    );

    res.json({
      data: {
        places: structuredData,
        success: true,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
});

// keyword search api

app.post("/places/keyword_search", async (req, res) => {
  const {
    language = "en",
    // radius = 2000,
    radius = 3000,
    // lng = -73.58781,
    // lat = 45.50884,
    lat =  6.592922,
    lng = 3.339059,
    type = "restaurant",
    keyword = "imperial",
  } = req.body;

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json
?input=${keyword}
&location=${lat}%2C${lng}
&radius=${radius}
&types=${type}
&key=${key}
&language=${language}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const structuredData = await Promise.all(
      data?.predictions?.map(async (attraction, i) => {
        const fetchReviews = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?placeid=${attraction.place_id}&key=${key}`
        );
        const reviewsData = await fetchReviews.json();

        return {
          editorial_summary: reviewsData?.result?.editorial_summary,
          weekday_text: reviewsData?.result?.current_opening_hours,
          business_status: reviewsData?.result?.business_status,
          attraction_address: reviewsData?.result?.formatted_address,
          terms: attraction?.terms,
          attraction_name: reviewsData?.result?.name,
          description: attraction?.description,
          ratings: reviewsData?.result?.rating,
          reference: attraction?.reference,
          attraction_types: reviewsData?.result?.types,
          user_ratings_total: reviewsData?.result?.user_ratings_total,
          geometry: reviewsData?.result?.geometry,
          international_phone_number:
            reviewsData?.result?.international_phone_number,
          formatted_phone_number:
            reviewsData?.result?.formatted_phone_number,
          map_url: reviewsData?.result?.url,
          attraction_images: reviewsData?.result?.photos?.map(
            (photo, i) =>
              `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${key}`
          ),
          website: reviewsData?.result?.website,
          vicinity: reviewsData?.result?.vicinity,
          user_reviews: reviewsData?.result?.reviews,
        };
      })
    );


    res.json({
      data: {
        places: structuredData,
        success: true,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
});

app.get("/", (req, res) => {
  res.send({
    welcome: "welcome to the google place map api implementation",
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
