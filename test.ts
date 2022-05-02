import {store} from './';

const foo = store(0,()=>{
  console.log("hello")

  return 2;
})