import { API, graphqlOperation } from "aws-amplify";
import { GraphQLResult, GRAPHQL_AUTH_MODE } from "@aws-amplify/api";
import Observable from 'zen-observable'; 


export interface GraphQLOptions {
  input?: object;
  variables?: object;
  authMode?: GRAPHQL_AUTH_MODE;
}

export async function callGraphQL<T>(query: any, options?: GraphQLOptions): Promise<GraphQLResult<T> | Observable<T>> {
  return (await API.graphql(graphqlOperation(query, options))) as GraphQLResult<T> | Observable<T>
}
