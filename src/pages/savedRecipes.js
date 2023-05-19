import Head from 'next/head'
import { useEffect, useState } from 'react'

import authService from '@/utils/authService'

import SavedRecipeCard from '@/components/savedRecipeCard'

function SavedRecipes() {
  useEffect(() => {
    if (authService.loggedIn() && !authService.tokenExpired()) {
      return
    } else {
      window.location.assign('/login')
    }
  })

  // Fetch user recipes from db
  const [myRecipes, setMyRecipes] = useState()
  const fetchRecipes = async () => {
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
  }

  useEffect(() => {
    fetchRecipes()

  }, [])

  return (
    <>
      <Head>
        <title>What am I craving?</title>
      </Head>
      <div className='min-h-full lg:px-[100px] px-6 py-12'>
        <div className='md:text-[30px] text-[16px] mb-[10px] text-black'>
          My Recipes
        </div>
        <div className='mx-auto max-w-7xl py-4'>
          <SavedRecipeCard myRecipes={myRecipes}/>
        </div>
      </div>
    </>
  )
}

export default SavedRecipes
