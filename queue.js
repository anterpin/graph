class Queue {
  constructor() {
    this.elements = {};
    this.head = 0;
    this.tail = 0;
  }
  enqueue(element) {
    this.elements[this.tail] = element;
    this.tail++;
  }
  dequeue() {
    const item = this.elements[this.head];
    delete this.elements[this.head];
    this.head++;
    return item;
  }
  peek() {
    return this.elements[this.head];
  }
  get length() {
    return this.tail - this.head;
  }
  get isEmpty() {
    return this.length === 0;
  }
}
class PriorityQueue extends Queue {
  enqueue(element, value) {
    this.elements[this.tail] = { element, value };
    this.tail++;
    let arr = Object.keys(this.elements).map(
      (element) => this.elements[element]
    );
    arr = arr.sort((a, b) => {
      return a.value - b.value;
    });
    this.elements = {};
    let count = 0;
    for (let i = this.head; i < this.tail; i++) {
      this.elements[i] = arr[count++];
    }
  }
  dequeue() {
    const item = this.elements[this.head];
    delete this.elements[this.head];
    this.head++;
    return item.element;
  }
}
