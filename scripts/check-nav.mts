import assert from "node:assert/strict";

import {
  buildOpenMap,
  buildTrail,
  hasActiveChild,
  isActiveLink,
  type NavNode,
} from "../src/lib/nav.ts";

const tree: NavNode[] = [
  { id: "home", title: "Home", link: "/home" },
  {
    id: "products",
    title: "Produtos",
    children: [
      { id: "products-all", title: "Todos", link: "/products" },
      {
        id: "products-shared",
        title: "Compartilhados",
        link: "/products/shared",
      },
    ],
  },
  {
    id: "config",
    title: "Configurações",
    children: [
      {
        id: "config-catalog",
        title: "Catálogo",
        children: [
          {
            id: "config-categories",
            title: "Categorias",
            link: "/config/categories",
          },
        ],
      },
    ],
  },
];

const products = tree[1].children as NavNode[];

assert.equal(isActiveLink("/home", "/home"), true);
assert.equal(isActiveLink("/home", "/products"), false);

assert.equal(isActiveLink("/home", "/home/detalhe"), true);

assert.equal(isActiveLink("/home", "/homologacao"), false);

assert.equal(
  isActiveLink("/products/shared", "/products/shared", products),
  true,
);
assert.equal(
  isActiveLink("/products", "/products/shared", products),
  false,
  "o item genérico não pode acender junto com o específico",
);
assert.equal(isActiveLink("/products", "/products", products), true);

assert.equal(isActiveLink("/", "/home"), false);
assert.equal(isActiveLink("/", "/"), true);

assert.equal(hasActiveChild(products, "/products/shared"), true);
assert.equal(hasActiveChild(products, "/home"), false);
assert.equal(
  hasActiveChild(tree[2].children, "/config/categories"),
  true,
  "a busca precisa descer mais de um nível",
);

assert.deepEqual(buildOpenMap(tree, "/config/categories"), {
  config: true,
  "config-catalog": true,
});
assert.deepEqual(buildOpenMap(tree, "/products/shared"), { products: true });

assert.deepEqual(buildOpenMap(tree, "/login"), {});

const trail = (pathname: string) =>
  buildTrail(tree, pathname).map((node) => node.title);

assert.deepEqual(trail("/home"), ["Home"]);

assert.deepEqual(trail("/products/shared"), ["Produtos", "Compartilhados"]);

assert.deepEqual(trail("/products"), ["Produtos", "Todos"]);

assert.deepEqual(trail("/config/categories"), [
  "Configurações",
  "Catálogo",
  "Categorias",
]);

assert.deepEqual(trail("/login"), []);

console.log("ok — navegação da sidebar: 13 invariantes");
