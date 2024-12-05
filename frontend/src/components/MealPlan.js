import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  useCreateMealPlanMutation,
  useUpdateMealPlanMutation,
} from "../slices/usersApiSlice";

const MealPlan = () => {
  const [currentDate] = useState(
    new Date().toISOString().split("T")[0] 
  );

  // State for meal inputs
  const [meal1, setMeal1] = useState("");
  const [meal2, setMeal2] = useState("");
  const [meal3, setMeal3] = useState("");
  const [meal4, setMeal4] = useState("");
  const [meal5, setMeal5] = useState("");
  const [snacks, setSnacks] = useState("");

  // Mutations for creating and updating meal plans
  const [createMealPlan] = useCreateMealPlanMutation();
  const [updateMealPlan] = useUpdateMealPlanMutation();

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        console.log("Fetching meal plan for date:", currentDate);
        const response = await fetch(`/api/user/meal-plan/${currentDate}`);
        if (!response.ok) throw new Error("Failed to fetch meal plan");
        const data = await response.json();

        console.log("Fetched Meal Plan Data:", data);
        setMeal1(data.meal1 || "");
        setMeal2(data.meal2 || "");
        setMeal3(data.meal3 || "");
        setMeal4(data.meal4 || "");
        setMeal5(data.meal5 || "");
        setSnacks(data.snacks || "");
        localStorage.setItem("mealPlan", JSON.stringify(data));
      } catch (error) {
        console.error("Fetch meal plan error:", error.message);
        const storedMealPlan = localStorage.getItem("mealPlan");
        if (storedMealPlan) {
          const parsedMealPlan = JSON.parse(storedMealPlan);
          setMeal1(parsedMealPlan.meal1 || "");
          setMeal2(parsedMealPlan.meal2 || "");
          setMeal3(parsedMealPlan.meal3 || "");
          setMeal4(parsedMealPlan.meal4 || "");
          setMeal5(parsedMealPlan.meal5 || "");
          setSnacks(parsedMealPlan.snacks || "");
        }
      }
    };

    fetchMealPlan();
  }, [currentDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mealPlanData = {
      date: currentDate,
      meal1,
      meal2,
      meal3,
      meal4,
      meal5,
      snacks,
    };

    try {
      console.log("Submitting meal plan data:", mealPlanData);
      const updatedMealPlan = await updateMealPlan(mealPlanData).unwrap();
      if (updatedMealPlan) {
        toast.success("Meal plan updated successfully!");
        return;
      }
    } catch (updateError) {
      console.error("Update meal plan error:", updateError.message);
    }

    try {
      const newMealPlan = await createMealPlan(mealPlanData).unwrap();
      if (newMealPlan) {
        toast.success("Meal plan created successfully!");
      }
    } catch (createError) {
      toast.error("Failed to save the meal plan.");
      console.error("Create meal plan error:", createError.message);
    }
  };

  return (
    <div>
      <h1>Meal Plan</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="date">
          <Form.Label>Date</Form.Label>
          <Form.Control type="text" value={currentDate} readOnly />
        </Form.Group>

        <Form.Group controlId="meal1">
          <Form.Label>Meal 1</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter meal 1"
            value={meal1}
            onChange={(e) => setMeal1(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="meal2">
          <Form.Label>Meal 2</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter meal 2"
            value={meal2}
            onChange={(e) => setMeal2(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="meal3">
          <Form.Label>Meal 3</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter meal 3"
            value={meal3}
            onChange={(e) => setMeal3(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="meal4">
          <Form.Label>Meal 4</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter meal 4"
            value={meal4}
            onChange={(e) => setMeal4(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="meal5">
          <Form.Label>Meal 5</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter meal 5"
            value={meal5}
            onChange={(e) => setMeal5(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="snacks">
          <Form.Label>Snacks</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter snacks"
            value={snacks}
            onChange={(e) => setSnacks(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="my-3">
          Save
        </Button>
      </Form>
    </div>
  );
};

export default MealPlan;
