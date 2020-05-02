import isPowerOfTwo from "../../../algorithms/math/is-power-of-two/isPowerOfTwo";

export default class SegmentTree {
  /**
   * @param {number[]} inputArray
   * @param {function} operation
   * @param {number} operationFallback
   */
  constructor(inputArray, operation, operationFallback) {
    this.inputArray = inputArray;
    this.operation = operation;
    this.operationFallback = operationFallback;

    this.segmentTree = this.initSegmentTree(this.inputArray);

    this.buildSegmentTree();
  }

  /**
   * @param {number[]} inputArray
   * @return {number[]}
   */
  initSegmentTree(inputArray) {
    let segmentTreeArrayLength;
    const inputArrayLength = inputArray.length;

    if (isPowerOfTwo(inputArrayLength)) {
      segmentTreeArrayLength = 2 * inputArrayLength - 1;
    } else {
      const currentPower = Math.floor(Math.log2(inputArrayLength));
      const nextPower = currentPower + 1;
      const nextPowerOfTwoNumber = 2 ** nextPower;
      segmentTreeArrayLength = 2 * nextPowerOfTwoNumber - 1;
    }

    return new Array(segmentTreeArrayLength).fill(null);
  }

  /**
   * Build segment tree
   */
  buildSegmentTree() {
    const leftIndex = 0;
    const rightIndex = this.inputArray.length - 1;
    const position = 0;
    this.buildTreeRecursively(leftIndex, rightIndex, position);
  }

  /**
   * @param {number} leftInputIndex
   * @param {number} rightInputIndex
   * @param {number} position
   */
  buildTreeRecursively(leftInputIndex, rightInputIndex, position) {
    if (leftInputIndex === rightInputIndex) {
      this.segmentTree[position] = this.inputArray[leftInputIndex];
      return;
    }

    const middleIndex = Math.floor((leftInputIndex + rightInputIndex) / 2);

    this.buildTreeRecursively(
      leftInputIndex,
      middleIndex,
      this.getLeftChildIndex(position)
    );

    this.buildTreeRecursively(
      middleIndex + 1,
      rightInputIndex,
      this.getRightChildIndex(position)
    );

    this.segmentTree[position] = this.operation(
      this.segmentTree[this.getLeftChildIndex(position)],
      this.segmentTree[this.getRightChildIndex(position)]
    );
  }

  /**
   * @param {number} queryLeftIndex
   * @param {number} queryRightIndex
   * @return {number}
   */
  rangeQuery(queryLeftIndex, queryRightIndex) {
    const leftIndex = 0;
    const rightIndex = this.inputArray.length - 1;
    const position = 0;

    return this.rangeQueryRecursive(
      queryLeftIndex,
      queryRightIndex,
      leftIndex,
      rightIndex,
      position
    );
  }

  /**
   * @param {number} queryLeftIndex
   * @param {number} queryRightIndex
   * @param {number} leftIndex
   * @param {number} rightIndex
   * @param {number} position
   * @return {number}
   */
  rangeQueryRecursive(
    queryLeftIndex,
    queryRightIndex,
    leftIndex,
    rightIndex,
    position
  ) {
    if (queryLeftIndex <= leftIndex && queryRightIndex >= rightIndex) {
      return this.segmentTree[position];
    }

    if (queryLeftIndex > rightIndex || queryRightIndex < leftIndex) {
      return this.operationFallback;
    }

    const middleIndex = Math.floor((leftIndex + rightIndex) / 2);

    const leftOperationResult = this.rangeQueryRecursive(
      queryLeftIndex,
      queryRightIndex,
      leftIndex,
      middleIndex,
      this.getLeftChildIndex(position)
    );

    const rightOperationResult = this.rangeQueryRecursive(
      queryLeftIndex,
      queryRightIndex,
      middleIndex + 1,
      rightIndex,
      this.getRightChildIndex(position)
    );

    return this.operation(leftOperationResult, rightOperationResult);
  }

  /**
   * @param {number} parentIndex
   * @return {number}
   */
  getLeftChildIndex(parentIndex) {
    return 2 * parentIndex + 1;
  }

  /**
   * @param {number} parentIndex
   * @return {number}
   */
  getRightChildIndex(parentIndex) {
    return 2 * parentIndex + 2;
  }
}
