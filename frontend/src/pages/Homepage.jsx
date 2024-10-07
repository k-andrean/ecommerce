import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

import HeroImage from 'assets/hero5.jpg'
import LevelUpImage from 'assets/hero4.jpg'

import { useGetAllCategoriesQuery } from 'services/categoriesAPI';
import { useGetAllCollectionsQuery } from 'services/collectionsAPI';



export default function HomePage() {

  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const { data: categoriesRespData, isSuccess: isSuccessCategory} = useGetAllCategoriesQuery();
  const { data: collectionsRespData, isSuccess: isSuccessCollection} = useGetAllCollectionsQuery();
  

  useEffect(() => {
      if (isSuccessCategory && categoriesRespData) {
          console.log('Category data:', categoriesRespData);
          const updatedCategories = categoriesRespData.map(category => ({
            ...category,
            image_path: process.env.REACT_APP_ECOMMERCE_URL + category.image_path.replace(/\\/g, '/'),
          }));
        
          setCategories(updatedCategories);
      }

      if (isSuccessCollection && collectionsRespData) {
        console.log('Collection data:', collectionsRespData);
        
        // Slice the first three items from collectionsRespData and then map through them
        const updatedCollection = collectionsRespData.slice(0, 3).map(collection => ({
          ...collection,
          image_path: process.env.REACT_APP_ECOMMERCE_URL + collection.image_path.replace(/\\/g, '/'),
        }));
      
        setCollections(updatedCollection);
        console.log(updatedCollection);
      }

  }, [isSuccessCategory, isSuccessCollection, categoriesRespData, collectionsRespData]);

  return (

      <main>
         {/* Hero section */}
      <div className="relative bg-gray-900">
        {/* Decorative image and overlay */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
           <img
            src={HeroImage}
            alt=""
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-gray-500 opacity-50" />


        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center sm:py-64 lg:px-0">
          <h1 className="text-5xl font-bold tracking-tight text-yellow-500 lg:text-7xl mb-4">New arrivals are here</h1>
          <p className="mt-4 text-xl text-white font-semibold">
            The new arrivals have, well, newly arrived. Check out the latest options from our summer small-batch release
            while they're still in stock.
          </p>
          <a
            href="#"
            className="mt-8 font-bold text-red-500 inline-block rounded-md border border-transparent bg-white px-8 py-3 text-base text-gray-900 hover:bg-gray-100"
          >
            Shop New Arrivals
          </a>
        </div>
      </div>

        {/* Category section */}
        <section aria-labelledby="category-heading" className="pt-24 sm:pt-32 xl:mx-auto xl:max-w-7xl xl:px-8">
          <div className="px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8 xl:px-0">
            <h2 id="category-heading" className="text-2xl text-red-500 font-bold tracking-tight text-gray-900">
              Shop by Category
            </h2>
            <a href="#" className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block">
              Browse all categories
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </div>

          <div className="mt-4 flow-root">
            <div className="-my-2">
              <div className="relative box-content h-80 overflow-x-auto py-2 xl:overflow-visible">
                <div className="min-w-screen-xl absolute flex space-x-8 px-4 sm:px-6 lg:px-8 xl:relative xl:grid xl:grid-cols-5 xl:gap-x-8 xl:space-x-0 xl:px-0">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/categories/${category.name}?id=${category.id}`}
                    className="relative flex h-80 w-56 flex-col overflow-hidden rounded-lg p-6 hover:opacity-75 xl:w-auto"
                  >
                    <span aria-hidden="true" className="absolute inset-0">
                      <img src={category.image_path} alt="" className="h-full w-full object-cover object-center" />
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-800 opacity-50"
                    />
                    <span className="relative mt-auto text-center text-xl font-bold text-white">{category.name}</span>
                  </Link>
                ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 px-4 sm:hidden">
            <a href="#" className="block text-sm font-semibold text-indigo-600 hover:text-indigo-500">
              Browse all categories
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </div>
        </section>

        {/* Featured section */}
        <section
          aria-labelledby="social-impact-heading"
          className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 sm:pt-32 lg:px-8"
        >
          <div className="relative overflow-hidden rounded-lg">
            <div className="absolute inset-0">
                <img
                src={LevelUpImage}
                alt=""
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="relative bg-gray-500 bg-opacity-60 px-6 py-32 sm:px-12 sm:py-40 lg:px-16">
              <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
                <h2 id="social-impact-heading" className="text-3xl font-bold tracking-tight text-yellow-500 sm:text-4xl">
                  <span className="block sm:inline">Level Up</span>
                </h2>
                <p className="mt-3 text-lg text-white font-semibold">
                  Make your desk beautiful and organized. Post a picture to social media and watch it get more likes
                  than life-changing announcements.
                </p>
                <a
                  href="#"
                  className="mt-8 font-bold text-red-500 block w-full rounded-md border border-transparent bg-white px-8 py-3 text-base text-gray-900 hover:bg-gray-100 sm:w-auto"
                >
                  Shop Workspace
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Collection section */}
        <section
          aria-labelledby="collection-heading"
          className="mx-auto max-w-xl px-4 pt-24 mb-20 sm:px-6 sm:pt-32 lg:max-w-7xl lg:px-8"
        >
          <h2 id="collection-heading" className="text-2xl text-red-500 font-bold tracking-tight text-gray-900">
            Shop by Collection
          </h2>
          <p className="mt-4 text-base text-gray-500">
            Each season, we collaborate with world-class designers to create a collection inspired by the natural world.
          </p>

          <div className="mt-10 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:space-y-0">
            {collections.map((collection) => (
              <a key={collection.name} href={collection.href} className="group block">
                <div
                  aria-hidden="true"
                  className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg lg:aspect-h-6 lg:aspect-w-5 group-hover:opacity-75"
                >
                  <img
                    src={collection.image_path}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <h3 className="mt-4 text-base font-bold text-red-500">{collection.name}</h3>
                <p className="mt-2 text-sm text-gray-500">{collection.description}</p>
              </a>
            ))}
          </div>
        </section>

      </main>

  )
}
