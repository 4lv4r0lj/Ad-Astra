---
title: "LeetCode: #1 Two Sum"
description: "Solving the classic Two Sum leetcode problem in Python, exploring various strategies."
authors: ["Akreed"]
tags: ["leetcode", "python", "array", "hash table", "two pointers", "sorting"]
pubDate: "13 Oct 2024"
image: "../../assets/posts/leetcode-1-two-sum.png"
---

This leetcode exercise can be found at https://leetcode.com/problems/two-sum

# Description

Given an array of integers `nums` and an integer `target`, return `indices` of the two numbers such that they add up to `target`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

# Examples

## Example 1

-   **Input**: `nums = [2, 7, 11, 15], target = 9`

-   **Output**: `[0, 1]`

-   **Explanation**: `Because nums[0] + nums[1] == 9, we return [0, 1]`

## Example 2:

-   **Input**: `nums = [3,2,4], target = 6`

-   **Output**: `[1,2]`

## Example 3:

-   **Input**: `nums = [3,3], target = 6`

-   **Output**: `[0,1]`

# Solutions

## Brute Force

-   **Key Idea**: Check every possible combination of two numbers and compare their sum with the target.
-   **Description**: The brute force method is the simplest and most straightforward solution. In this approach, we examine every possible pair of elements in the array and check if their sum matches the target value. For each element, we loop through the rest of the array to find a complementary element that adds up to the target. While this guarantees finding a solution, it is inefficient because it checks all pairs, leading to a time complexity that grows quadratically as the input size increases.
-   **Time Complexity**: O(n<sup>2</sup>)
-   **Space Complexity**: O(1)
-   **Implementation**:

    ```python
        def two_sum(nums, target):
            for i in range(len(nums)):
                for j in range(i + 1, len(nums)):
                    if nums[i] + nums[j] == target:
                        return [i, j]
    ```

## Hash Map

-   **Key Idea**: Use a hash map to store the difference between the target and each element (the complement). This allows you to instantly check if a complement has already been seen as you iterate through the list.
-   **Description**: This method improves efficiency by using a hash map (Python’s dictionary) to store the numbers we've already seen along with their indices. As we iterate through the array, for each number, we calculate the complement (the value that, when added to the current number, equals the target). Before moving on, we check if the complement already exists in the hash map. If it does, we’ve found our two numbers, and we return their indices. This approach works in linear time because checking the hash map for a complement is an O(1) operation.
-   **Time Complexity**: O(n)
-   **Space Complexity**: O(n)
-   **Implementation**:

    ```python
        def two_sum(nums, target):
            complement_dict = {}
            for i, num in enumerate(nums):
                complement = target - num
                if complement in complement_dict:
                    return [complement_dict[complement], i]
                complement_dict[num] = i
    ```

## Sorting and Two Pointers

-   **Key Idea**: Sort the array and use two pointers to efficiently find two numbers that sum to the target by shrinking the search space as needed.
-   **Description**: The sorting and two-pointer technique is another way to solve this problem, though it requires modifying the original array. First, you sort the array while keeping track of the original indices of the elements. After sorting, you place one pointer at the beginning (`left`) and another pointer at the end (`right`) of the sorted array. By calculating the sum of the two pointers, you can adjust them based on the result:
    -   If the sum is greater than the target, move the `right` pointer leftward (to a smaller number).
    -   If the sum is smaller than the target, move the `left` pointer rightward (to a larger number).
    -   If the sum matches the `target`, return the original indices of the numbers.
-   **Time Complexity**: O(n log n) (due to the sorting step)
-   **Space Complexity**: O(n) (space for storing the original indices and the sorted array)
-   **Implementation**:

    ```python
        def two_sum(nums, target):
            nums_with_index = [(num, i) for i, num in enumerate(nums)]
            nums_with_index.sort()

            left, right = 0, len(nums) - 1
            while left < right:
                current_sum = nums_with_index[left][0] + nums_with_index[right][0]
                if current_sum == target:
                    return [nums_with_index[left][1], nums_with_index[right][1]]
                elif current_sum < target:
                    left += 1
                else:
                    right -= 1
    ```
