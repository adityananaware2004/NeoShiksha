import React from 'react'
import {toast} from "react-hot-toast"
import { apiConnector } from '../apiconnector';
import { catalogData } from '../apis';

export const getCatalogaPageData = async(categoryId) => {
  const toastId = toast.loading("Loading...");
  let result = [];
  try{
        const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API, 
        {categoryId: categoryId,});

        if(!response?.data?.success)
            throw new Error("Could not Fetch Category page data");

         result = response?.data;

  }
  catch(error) {
    console.log("CATALOG PAGE DATA API ERROR....", error);
    
    // Handle 404 gracefully - return empty data structure
    if (error?.response?.status === 404) {
      result = {
        success: true,
        message: "No courses found for this category",
        selectedCategory: { courses: [] },
        differentCategory: null,
        mostSellingCourses: []
      };
    } else {
    toast.error(error.message);
      result = error.response?.data || {
        success: false,
        message: "Could not fetch category data"
      };
    }
  }
  toast.dismiss(toastId);
  return result;
}
