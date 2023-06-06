import Head from 'next/head'
import { useEffect, useState } from 'react'
import { FaceFrownIcon } from '@heroicons/react/24/outline'

import authService from '@/utils/authService'

import SavedRecipeCard from '@/components/savedRecipeCard'
import SavedRecipesEmptyState from '@/components/emptyStates/savedRecipesEmptyState'

function SavedRecipes() {
  useEffect(() => {
    if (authService.loggedIn() && !authService.tokenExpired()) {
      return
    } else {
      window.location.assign('/login')
    }
  })

  // Fetch user recipes from db
  const [toggle, setToggle] = useState(true)
  const [myRecipes, setMyRecipes] = useState()
  const fetchRecipes = async () => {
    try {
      const response = await fetch('/api/savedRecipe', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authService.getToken()
        }
      })

      const data = await response.json()
      const convertedData = data.map((object) => {
        return ({
          ...object,
          ingredients: JSON.parse(object.ingredients),
          instructions: JSON.parse(object.instructions)
        })
      })

      setMyRecipes(convertedData)

    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchRecipes()

  }, [toggle])

  return (
    <>
      <Head>
        <title>What am I craving?</title>
      </Head>
      {myRecipes?.length > 0
        ? <div className='min-h-full lg:px-[100px] px-6 py-12'>
          <h1 className='md:text-[30px] text-[16px] mb-[10px] text-black'>
            My Recipes
          </h1>
          <div className='mx-auto max-w-7xl py-4'>
            <SavedRecipeCard myRecipes={myRecipes} setToggle={setToggle} />
          </div>
        </div>
        : myRecipes?.length < 1
          ? <section className='flex flex-col justify-center items-center w-full'>
            <article className='min-h-full lg:px-[100px] px-6 pt-36 md:text-[30px] text-center align-center'>
            <FaceFrownIcon className='w-14 md:w-36 mx-auto text-black' />
            <p className='text-black'>You have no saved recipes</p>
          </article>
          <article className='w-full px-2 md:px-96 mt-8'>
            <SavedRecipesEmptyState />
            </article>
          </section>
          : <div></div>
      }
    </>
  )
}

export default SavedRecipes