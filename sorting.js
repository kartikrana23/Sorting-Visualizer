let array = [];
let barsContainer = document.getElementById('bars-container');
let sortSpeed = 10; // Default sorting speed (ms)
let arraySize = 10; // Default array size
let isSorting = false; // keeps track ff onging sorting

// Generate a new array with random values
function generateArray() {
  if (isSorting) {
    // Stops sorting then and there ongoing sorting
    isSorting = false;
  }
  array = [];
  barsContainer.innerHTML = '';
  for (let i = 0; i < arraySize; i++) {
    array.push(Math.floor(Math.random() * 250) + 1);
    const bar = document.createElement('div');
    bar.style.height = `${array[i]}px`;
    bar.classList.add('bar');
    bar.style.backgroundColor = 'green'; // Set the default color to green
    barsContainer.appendChild(bar);
  }
}
// Reset the array and regenerate
function resetArray() {
  generateArray();
}
// Update the speed of sorting
function updateSpeed(value,max) {
  sortSpeed = max-value; // Adjusting for a more intuitive speed range
}
// Update the size of array and regenerate
function updateArraySize(value) {
  if (isSorting) {
    return; // If sorting is in progress, do not update array size
  }
  arraySize = value;
  generateArray();
}
// Add event listener for the array size slider
document.getElementById('array-size-slider').addEventListener('input', (event) => {
  updateArraySize(event.target.value);
});

// Helper function to delay execution
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
// Bubble sort algorithm
async function bubbleSort() {
  if (isSorting) return;
  isSorting = true;
  for (let i = 0; i < arraySize; i++) {
    for (let j = 0; j < arraySize - i - 1; j++) {
      if (!isSorting) return; // Stop sorting if new array is generated
      await sleep(sortSpeed);
      // Visualize the comparison
      if (array[j] > array[j + 1]) {
        // Visualize the swap
        visualizeComparison(j, j + 1);
        await sleep(sortSpeed); // Wait for the red color to be visible
        // Swap if necessary
        swap(j, j + 1);
        // Revert color back to default
        revertColor(j, j + 1);
      }
    }
  }
  isSorting = false;
}
// Selection sort algorithm
async function selectionSort() {
  if (isSorting) return;
  isSorting = true;
  for (let i = 0; i < arraySize - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < arraySize; j++) {
      if (!isSorting) return; // Stop sorting if new array is generated
      await sleep(sortSpeed);
      // Visualize the comparison
      visualizeComparison(minIndex, j);
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
      revertColor(minIndex, j); // Revert the color after comparison
    }
    // Swap elements if necessary
    if (minIndex !== i) {
      // Visualize the swap
      visualizeComparison(i, minIndex);
      await sleep(sortSpeed); // Wait for the red color to be visible
      swap(minIndex, i);
      // Revert color back to default after the swap
      revertColor(i, minIndex);
    }
  }
  isSorting = false;
}
//for insertion sort
async function insertionSort() {
  isSorting = true;
  for (let i = 1; i < arraySize; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      if (!isSorting) return; // Stop sorting if new array is generated
      await sleep(sortSpeed);
      // Visualize the comparison and the swap
      visualizeComparison(j + 1, j);
      await sleep(sortSpeed); // Wait for the red color to be visible
      // Move elements greater than key one position ahead
      array[j + 1] = array[j];
      // Update heights of bars
      updateBarHeight(j + 1, array[j]);
      revertColor(j + 1, j); // Revert the color after swapping
      j--;
    }
    array[j + 1] = key;
    updateBarHeight(j + 1, key);
    revertColor(j + 1, j + 1); // Revert the color after placing the key
  }
  isSorting = false;
}
// Merge sort algorithm
async function mergeSort() {
  if (isSorting) return;
  isSorting = true;
  await mergeSortRecursive(0, arraySize - 1);
  isSorting = false;
}
async function mergeSortRecursive(left, right) {
  if (left >= right || !isSorting) {
    return;
  }
  let mid = left + Math.floor((right - left) / 2);
  await mergeSortRecursive(left, mid);
  await mergeSortRecursive(mid + 1, right);
  await merge(left, mid, right);
}

async function merge(left, mid, right) {
  let n1 = mid - left + 1;
  let n2 = right - mid;
  let L = new Array(n1);
  let R = new Array(n2);
  for (let i = 0; i < n1; i++) {
    L[i] = array[left + i];
  }
  for (let j = 0; j < n2; j++) {
    R[j] = array[mid + 1 + j];
  }
  let i = 0, j = 0, k = left;
  while (i < n1 && j < n2) {
    if (!isSorting) return; // Stop sorting if new array is generated
    await sleep(sortSpeed);
    // Visualize the comparison
    visualizeComparison(left + i, mid + 1 + j);
    if (L[i] <= R[j]) {
      array[k] = L[i];
      updateBarHeight(k, L[i]);
      i++;
    } else {
      array[k] = R[j];
      updateBarHeight(k, R[j]);
      j++;
    }
    k++;
  }
  while (i < n1) {
    array[k] = L[i];
    updateBarHeight(k, L[i]);
    i++;
    k++;
  }
  while (j < n2) {
    array[k] = R[j];
    updateBarHeight(k, R[j]);
    j++;
    k++;
  }
  // Revert color back to default
  for (let i = left; i <= right; i++) {
    revertColor(i, i);
  }
}

// Quick sort algorithm
async function quickSort() {
  if (isSorting) return;
  isSorting = true;
  await quickSortRecursive(0, arraySize - 1);
  isSorting = false;
}

async function quickSortRecursive(low, high) {
  if (low < high && isSorting) {
    let pi = await partition(low, high);
    await quickSortRecursive(low, pi - 1);
    await quickSortRecursive(pi + 1, high);
  }
}

async function partition(low, high) {
  let pivot = array[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (!isSorting) return; // Stop sorting if new array is generated
    await sleep(sortSpeed);
    if (array[j] < pivot) {
      i++;
      // Visualize the swap
      visualizeComparison(i, j);
      await sleep(sortSpeed); // Wait for the red color to be visible
      swap(i, j);
      // Revert color back to default after the swap
      revertColor(i, j);
    }
  }
  // Visualize the swap
  visualizeComparison(i + 1, high);
  await sleep(sortSpeed); // Wait for the red color to be visible
  swap(i + 1, high);
  // Revert color back to default after the swap
  revertColor(i + 1, high);
  return i + 1;
}

// Heap sort algorithm
async function heapSort() {
  if (isSorting) return;
  isSorting = true;
  let n = arraySize;
  // Build heap (rearrange array)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    if (!isSorting) return; // Stop sorting if new array is generated
    await heapify(n, i);
  }
  // One by one extract an element from heap
  for (let i = n - 1; i > 0; i--) {
    if (!isSorting) return; // Stop sorting if new array is generated
    // Move current root to end
    await sleep(sortSpeed);
    visualizeComparison(0, i);
    await sleep(sortSpeed); // Wait for the red color to be visible
    swap(0, i);
    revertColor(0, i); // Revert the color after swap
    // call max heapify on the reduced heap
    await heapify(i, 0);
  }
  isSorting = false;
}

async function heapify(n, i) {
  let largest = i; // Initialize largest as root
  let l = 2 * i + 1; // left 
  let r = 2 * i + 2; // right

  // If left child is larger than root
  if (l < n && array[l] > array[largest]) {
    largest = l;
  }

  // If right child is larger than largest so far
  if (r < n && array[r] > array[largest]) {
    largest = r;
  }

  // If largest is not root
  if (largest !== i) {
    visualizeComparison(i, largest);
    await sleep(sortSpeed); // Wait for the red color to be visible
    swap(i, largest);
    revertColor(i, largest); // Revert the color after swap
    // Recursively heapify the affected sub-tree
    await heapify(n, largest);
  }
}
// Visualize comparison (change color to red)
function visualizeComparison(index1, index2) {
  const bars = document.querySelectorAll('.bar');
  bars[index1].style.backgroundColor = 'red';
  bars[index2].style.backgroundColor = 'red';
}

// Swap two bars in the array and update their heights
function swap(index1, index2) {
  let temp = array[index1];
  array[index1] = array[index2];
  array[index2] = temp;

  const bars = document.querySelectorAll('.bar');
  const tempHeight = bars[index1].style.height;
  bars[index1].style.height = bars[index2].style.height;
  bars[index2].style.height = tempHeight;
}
// Update the height of a bar in the array
function updateBarHeight(index, newHeight) {
  array[index] = newHeight;
  const bars = document.querySelectorAll('.bar');
  bars[index].style.height = `${newHeight}px`;
}
// Revert the color of bars to default
function revertColor(index1, index2) {
  const bars = document.querySelectorAll('.bar');
  bars[index1].style.backgroundColor = 'green';
  bars[index2].style.backgroundColor = 'green';
}