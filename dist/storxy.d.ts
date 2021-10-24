export declare function store<V>(
  initial?: V,
  onfirst?: () => void | (() => void)
): {
  $: V;
  subscribe(value: (value: V) => void): () => void;
  $$(value: (value: V) => void): () => void;
};

export declare function computed<V>(
  deps: {
    $: V;
    subscribe(value: (value: V) => void): () => void;
    $$(value: (value: V) => void): () => void;
  },
  fn: ($: V) => V
): {
  $: V;
  subscribe(value: (value: V) => void): () => void;
  $$(value: (value: V) => void): () => void;
};

export declare function computed<V>(
  deps: Array<{
    $: V;
    subscribe(value: (value: V) => void): () => void;
    $$(value: (value: V) => void): () => void;
  }>,
  fn: ($: V[]) => V
): {
  $: V;
  subscribe(value: (value: V) => void): () => void;
  $$(value: (value: V) => void): () => void;
};
