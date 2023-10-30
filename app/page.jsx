"use client";
/* eslint-disable @next/next/no-img-element */
import React from "react";
import axios from "axios";
import Link from "next/link";
import Head from "next/head";
import Modal from "@/components/Modal";

const getDate = (dateString) => {
  const [day, month, year] = dateString.split(" ");
  const monthMap = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };
  const dayInt = parseInt(day, 10);
  const monthInt = monthMap[month];
  const yearInt = parseInt(year, 10);
  const dateObject = new Date(yearInt, monthInt, dayInt);
  return dateObject;
};

const getReg = (ad) => {
  if (ad.registration_city.toLowerCase().replace("-", "") === "unregistered") {
    return ad.registration_province;
  } else {
    return ad.registration_city;
  }
};

const carModels = [
  // { label: "All", value: "md_cultus/md_baleno/md_liana" },
  { label: "Cultus", value: "md_cultus" },
  // { label: "Baleno", value: "md_baleno" },
  // { label: "Liana", value: "md_liana" },
];

const years = [
  2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012,
  2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023,
];

const prices = [
  100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000,
  1000000, 1100000, 1200000, 1300000, 1400000, 1500000, 1600000, 1700000,
];

const getYearsRange = (min, max) => {
  return years.filter((a) => a >= min && a <= max);
};

const getPriceRange = (min, max) => {
  return prices.filter((a) => a >= min && a <= max);
};

const Cultus = () => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [carModel, setCarModel] = React.useState(carModels[0].value);
  const [priceRange, setPriceRange] = React.useState([700000, 1300000]);
  const [modelRange, setModelRange] = React.useState([2005, 2015]);

  const [showSummary, setShowSummary] = React.useState(false);
  const [searchPage, setSearchPage] = React.useState(1);

  React.useEffect(() => {
    (async () => {
      setError(false);
      setLoading(true);
      try {
        let ads_temp = [];
        let i = 1;
        // while (ads_temp.length < 100) {
        const { data } = await axios.get(
          `https://www.pakwheels.com/used-cars/search/-/mk_suzuki/${carModel}/ct_islamabad/ct_rawalpindi/pr_${priceRange.join(
            "_"
          )}/yr_${modelRange.join(
            "_"
          )}.json?client_id=37952d7752aae22726aff51be531cddd&client_secret=014a5bc91e1c0f3af4ea6dfaa7eee413&api_version=19&extra_info=true&page=${searchPage}`
        );

        // console.log(data.result[0]);

        // i++;
        // }
        let stringed = data.result.map((a) => JSON.stringify(a));
        const unique = [...new Set(stringed)].map((x) => JSON.parse(x));

        setData((p) => [
          ...p,
          ...unique.sort(
            (a, b) => getDate(b.created_at) - getDate(a.created_at)
          ),
        ]);
      } catch (error) {
        console.log("Error Occurred", error);
        setError(true);
        setData([]);
      }
      setLoading(false);
    })();
  }, [carModel, modelRange, priceRange, searchPage]);

  console.log(modelRange);

  return (
    <div className="flex flex-col w-full items-center px-3 bg-gray-200 min-h-screen">
      <Head>
        <title>Car Search</title>
      </Head>

      <h1 className="text-lg text-center mt-12 mb-3 uppercase font-semibold">
        Latest Cars
      </h1>

      <div className="flex flex-row w-full max-w-6xl mx-auto flex-wrap gap-3 items-start py-4">
        {/* <button
              onClick={() => setShowSummary(true)}
              className="bg-cyan-600 rounded-lg uppercase px-3 py-2 font-medium text-white"
            >
              See Summary
            </button> */}
        <div className="bg-gray-300 rounded-lg uppercase px-3 py-2 font-medium text-black flex flex-row">
          <p>Model :</p>
          <select
            value={carModel}
            onChange={(e) => setCarModel(e.target.value)}
            className="font-bold bg-transparent px-3 outline-none text-black appearance-none"
          >
            {carModels.map((model) => (
              <option value={model.value} key={model.value}>
                {model.label}
              </option>
            ))}
          </select>
        </div>
        <div className="bg-gray-300 rounded-lg uppercase px-3 py-2 font-medium text-black flex flex-row">
          <p>Price :</p>

          <select
            value={priceRange[0]}
            onChange={(e) => setPriceRange((p) => [+e.target.value, p[1]])}
            className="font-bold bg-transparent px-3 outline-none text-black appearance-none"
          >
            {getPriceRange(prices[0], priceRange[1] - 1).map((price) => (
              <option value={price} key={price}>
                {price}
              </option>
            ))}
          </select>
          <span> - </span>
          <select
            value={priceRange[1]}
            onChange={(e) => setPriceRange((p) => [p[0], +e.target.value])}
            className="font-bold bg-transparent px-3 outline-none text-black appearance-none"
          >
            {getPriceRange(priceRange[0] + 1, prices[prices.length - 1]).map(
              (price) => (
                <option value={price} key={price}>
                  {price}
                </option>
              )
            )}
          </select>
        </div>
        <div className="bg-gray-300 rounded-lg uppercase px-3 py-2 font-medium text-black flex flex-row">
          <p>Model :</p>

          <select
            value={modelRange[0]}
            onChange={(e) => setModelRange((p) => [+e.target.value, p[1]])}
            className="font-bold bg-transparent px-3 outline-none text-black appearance-none"
          >
            {getYearsRange(2000, modelRange[1] - 1).map((model) => (
              <option value={model} key={model}>
                {model}
              </option>
            ))}
          </select>
          <span> - </span>
          <select
            value={modelRange[1]}
            onChange={(e) => setModelRange((p) => [p[0], +e.target.value])}
            className="font-bold bg-transparent px-3 outline-none text-black appearance-none"
          >
            {getYearsRange(modelRange[0] + 1, 2023).map((model) => (
              <option value={model} key={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
        {data.length > 0 && (
          <Modal show={showSummary}>
            <div className="h-full w-full relative p-1">
              <div
                className="absolute top-2 font-bold text-lg right-2 text-red-600 cursor-pointer"
                onClick={() => setShowSummary(false)}
              >
                x
              </div>
              <div className="text-xl font-bold text-center w-full mt-2">
                Results Summary
              </div>

              <div className="w-full p-2 border-collapse">
                <table className="w-full table-fixed text-center">
                  <thead>
                    <tr className="font-medium">
                      <th className="border border-neutral-300 p-1">Model</th>
                      <th className="border border-neutral-300 px-2">
                        No. of Ads
                      </th>
                      <th className="border border-neutral-300 px-2">
                        Avg Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from(new Set(data.map((ad) => ad.model_year)))
                      .sort((a, b) => a - b)
                      .map((year, i) => (
                        <tr key={i}>
                          <td className="border border-neutral-300 p-1 font-mono">
                            {year}
                          </td>
                          <td className="border border-neutral-300 px-2 font-mono">
                            <p className="relative z-10">
                              {
                                data.filter((ad) => ad.model_year === year)
                                  .length
                              }
                            </p>
                          </td>
                          <td className="border border-neutral-300 px-2 font-mono">
                            {Math.round(
                              data
                                .filter((ad) => ad.model_year === year)
                                .reduce((a, ad) => a + Number(ad.price), 0) /
                                data.filter((ad) => ad.model_year === year)
                                  .length
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {/* Averge Price:{" "}
                  {data.reduce((a, ad) => a + Number(ad.price), 0) /
                    data.length} */}
              </div>
            </div>
          </Modal>
        )}
      </div>

      <div className="w-full flex flex-col gap-2">
        <div className="w-full max-w-6xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mx-auto">
          {data.map((ad, i) => (
            <Card ad={ad} key={i} />
          ))}
        </div>
        {loading ? (
          <div className="flex flex-row gap-2 items-center justify-center py-4">
            <div className="bg-transparent rounded-full border-l-2 border-rose-500 h-6 w-6 animate-spin"></div>
            <div className="text-rose-500">Loading</div>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full max-w-6xl py-4 mx-auto">
            <button
              className="px-6 py-2 font-medium bg-sky-700 hover:bg-sky-600 text-white"
              onClick={() => setSearchPage((p) => p + 1)}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Card = ({ ad }) => {
  return (
    <Link
      href={`https://www.pakwheels.com${ad.url_slug}`}
      target="__blank"
      className="bg-white shadow rounded-lg overflow-hidden text-sm"
    >
      <img
        src={ad?.pictures[0]?.picture_thumbnail}
        className="w-full aspect-square object-cover"
        alt="car"
      />
      <div className="flex flex-col gap-1 p-2">
        <p>
          <span className="font-semibold text-gray-800">
            {Number(ad.price).toLocaleString("en-IN")}
          </span>
        </p>
        <p className="h-5 overflow-hidden">{ad.title}</p>
        <div className="flex flex-row gap-1">
          <p className="text-xs text-purple-600">{ad.model_year}</p>
          <p className="text-xs text-rose-600">{getReg(ad)}</p>
        </div>
        <p className="text-xs">{ad.created_at}</p>
        <div className="text-xs font-medium">
          {ad.city_area}, {ad.city_name}
        </div>
      </div>
    </Link>
  );
};

export default Cultus;
