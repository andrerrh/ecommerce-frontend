import { gql } from '@apollo/client'

export const ALL_PRODUCTS = gql`
query {
    products {
        id
        name
        price
        description
        total_rating
        positive_rating
        image1
        image2
        image3
        image4
        image5
        id_brands
        id_categories
        brands {
            id
            name
        }
        categories {
            id
            name
        }
    }
}
`

export const FULL_PRODUCT = gql`
query product($id: ID!){
    product(id: $id) {
        id
        name
        price
        description
        total_rating
        positive_rating
        image1
        image2
        image3
        image4
        image5
        id_brands
        id_categories
        brands {
            id
            name
        }
        categories {
            id
            name
        }
    }
}
`

export const PRODUCT_BRAND_CATEGORIES = gql`
query {
    products {
        id
        name
        id_brands
        id_categories
        brands {
            id
            name
        }
        categories {
            id
            name
        }
    }
}
`

export const BRANDS_AND_CATEGORIES = gql`
query {
    brands {
        id
        name
    }
    categories {
        id
        name
    }
}
`

export const GET_BRANDS = gql`
query {
    brands {
        id
        name
    }
}
`

export const ADD_BRAND = gql`
    mutation CreateBrand($name: String!) {
        createBrand(input: {name: $name})
        {
            id
            name
        }
    }
`

export const ADD_CATEGORY = gql`
    mutation CreateCategory($name: String!) {
        createCategory(input: {name: $name})
        {
            id
            name
        }
    }
`

export const ADD_PRODUCT = gql`
    mutation CreateProduct(
        $name: String!
        $price: Float!
        $description: String
        $positive_rating: Int
        $total_rating: Int
        $image1: String
        $image2: String
        $image3: String
        $image4: String
        $image5: String
        $id_brands: Int!
        $id_categories: Int!
    )
    {
        createProduct(input: {
            name: $name
            price: $price
            description: $description
            positive_rating: $positive_rating
            total_rating: $total_rating
            image1: $image1
            image2: $image2
            image3: $image3
            image4: $image4
            image5: $image5
            id_brands: $id_brands
            id_categories: $id_categories
        }) {
            id
            name
    }
    }
`

export const UPDATE_PRODUCT = gql`
    mutation UpdateProduct(
        $id: ID!
        $name: String!
        $price: Float!
        $description: String
        $positive_rating: Int
        $total_rating: Int
        $image1: String
        $image2: String
        $image3: String
        $image4: String
        $image5: String
        $id_brands: Int!
        $id_categories: Int!
    )
    {
        updateProduct(id: $id, input: {
            name: $name
            price: $price
            description: $description
            positive_rating: $positive_rating
            total_rating: $total_rating
            image1: $image1
            image2: $image2
            image3: $image3
            image4: $image4
            image5: $image5
            id_brands: $id_brands
            id_categories: $id_categories
        }) {
            id
            name
    }
    }
`

export const DELETE_PRODUCT = gql`
    mutation DeleteProduct($id: ID!) {
        deleteProduct(id: $id) {
            id
            name
        }
    }
`

export const CREATE_USER = gql`
    mutation CreateUser(
        $name: String!
        $email: String!
        $password: String!
        )
        {
            createUser(input: {
                name: $name
                email: $email
                password: $password
            }) {
                id
                name
                token
            }
        }
`

export const LOGIN_USER = gql`
    mutation LoginUser(
        $email: String!
        $password: String!
        )
        {
            loginUser(input: {
                email: $email
                password: $password
            }) {
                id
                name
                token
            }
        }
`
export const USER_NAME_EMAIL_AVATAR = gql`
        query User($id: ID!) {
            user(id: $id) {
                name
                email
                avatar
            }
        }
`

export const UPDATE_USER = gql`
    mutation UpdateUser(
        $id: ID!
        $name: String
        $email: String
        $avatar: String
        )
        {
            updateUser(id: $id, input: {
                name: $name
                email: $email
                avatar: $avatar
            }) {
                name
                token
            }
        }
`

export const CART = gql`
        query Cart($id: ID!) {
            cart(id: $id) {
                id
                product {
                    id
                    name
                    price
                    image1
                    brands {
                        name
                    }
                }
            }
        }
`

export const CART_UPDATE = gql`
        mutation UpdateCart(
            $id_user: Int!
            $id_product: Int!
        ) {
            updateCart(input: {
                id_user: $id_user
                id_product: $id_product
            }) {
                id
            }
        }
`

export const DELETE_CART = gql`
        mutation DeleteCart(
            $id: ID!
        ) {
            deleteCart(id: $id) {
                id
            }
        }
`

export const DELETE_ALL_CART = gql`
        mutation DeleteAllCart(
            $id: ID!
        ) {
            deleteAllCart(id: $id) {
                id
            }
        }
`

export const UPDATE_PASSWORD = gql`
        mutation UpdateUserPassword(
            $id: ID!
            $oldPassword: String!
            $newPassword: String!
        ) {
            updateUserPassword(id: $id, input: {
                oldPassword: $oldPassword
                newPassword: $newPassword
            }) {
                id
                name
            }
        }
`

export const PURCHASES = gql`
        query Purchases($id: ID!) {
            purchases(id: $id) {
                id
                id_user
                id_product
                purchase_date
                quantity
                price_payed
                product_name
                image
            }
        }
`

export const UPDATE_PURCHASES = gql`
        mutation UpdatePurchases(
            $id_user: Int!
            $id_product: Int!
            $product_name: String!
            $purchase_date: String!
            $quantity: Int!
            $price_payed: Float!
            $image: String!
        ) {
            updatePurchases(input: {
                id_user: $id_user
                id_product: $id_product
                product_name: $product_name
                purchase_date: $purchase_date
                quantity: $quantity
                price_payed: $price_payed
                image: $image
            }) {
                    id
            }
        }
`