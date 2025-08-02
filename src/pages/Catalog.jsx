import React, { useEffect, useState } from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogaPageData } from '../services/operations/pageAndComponentData';
import Course_Card from '../components/core/Catalog/Course_Card';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import { useSelector } from "react-redux"
import Error from "./Error"

const Catalog = () => {

    const { loading } = useSelector((state) => state.profile)
  const { catalogName } = useParams()
  const [active, setActive] = useState(1)
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");

    //Fetch all categories
    useEffect(()=> {
        const getCategories = async() => {
            try {
                const res = await apiConnector("GET", categories.CATEGORIES_API);
                console.log("Categories response:", res?.data?.data);
                console.log("Catalog name:", catalogName);
                
                // Try multiple matching strategies
                const category = res?.data?.data?.find((ct) => {
                    const categoryNameLower = ct.name.toLowerCase();
                    const catalogNameLower = catalogName.toLowerCase();
                    
                    // Direct match
                    if (categoryNameLower === catalogNameLower) return true;
                    
                    // Match with spaces replaced by hyphens
                    if (categoryNameLower.replace(/\s+/g, '-') === catalogNameLower) return true;
                    
                    // Match with hyphens replaced by spaces
                    if (categoryNameLower === catalogNameLower.replace(/-/g, ' ')) return true;
                    
                    return false;
                });
                
                if (category) {
                    console.log("Found category:", category);
                    setCategoryId(category._id);
                } else {
                    console.log("No category found for:", catalogName);
                    // Set a default category or handle the error
                    if (res?.data?.data?.length > 0) {
                        setCategoryId(res.data.data[0]._id);
                    }
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        }
        getCategories();
    },[catalogName]);

    useEffect(() => {
        const getCategoryDetails = async() => {
            try{
                console.log("Fetching category details for ID:", categoryId);
                const res = await getCatalogaPageData(categoryId);
                console.log("Category details response:", res);
                setCatalogPageData(res);
            }
            catch(error) {
                console.error("Error fetching category details:", error);
            }
        }
        if(categoryId) {
            getCategoryDetails();
        }
        
    },[categoryId]);


    if (loading || !catalogPageData) {
        return (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="spinner"></div>
          </div>
        )
      }
      if (!loading && !catalogPageData.success) {
        return <Error />
      }
    
      return (
        <>
          {/* Hero Section */}
          <div className=" box-content bg-richblack-800 px-4">
            <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
              <p className="text-sm text-richblack-300">
                {`Home / Catalog / `}
                <span className="text-yellow-25">
                  {catalogPageData?.selectedCategory?.name}
                </span>
              </p>
              <p className="text-3xl text-richblack-5">
                {catalogPageData?.selectedCategory?.name}
              </p>
              <p className="max-w-[870px] text-richblack-200">
                {catalogPageData?.selectedCategory?.description}
              </p>
            </div>
          </div>
    
          {/* Section 1 */}
          <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">Courses to get you started</div>
            <div className="my-4 flex border-b border-b-richblack-600 text-sm">
              <p
                className={`px-4 py-2 ${
                  active === 1
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
                onClick={() => setActive(1)}
              >
                Most Populer
              </p>
              <p
                className={`px-4 py-2 ${
                  active === 2
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
                onClick={() => setActive(2)}
              >
                New
              </p>
            </div>
            <div>
              <CourseSlider
                Courses={catalogPageData?.selectedCategory?.courses}
              />
            </div>
          </div>
          {/* Section 2 */}
          <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">
              Top courses in {catalogPageData?.differentCategory?.name}
            </div>
            <div className="py-8">
              <CourseSlider
                Courses={catalogPageData?.differentCategory?.courses}
              />
            </div>
          </div>
    
          {/* Section 3 */}
          <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">Frequently Bought</div>
            <div className="py-8">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {catalogPageData?.mostSellingCourses
                  ?.slice(0, 4)
                  .map((course, i) => (
                    <Course_Card course={course} key={i} Height={"h-[400px]"} />
                  ))}
              </div>
            </div>
          </div>
    
          <Footer />
        </>
      )
    }
    
    export default Catalog