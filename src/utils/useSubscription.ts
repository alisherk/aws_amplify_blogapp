import { useState, useEffect } from 'react'; 
import { API, graphqlOperation } from 'aws-amplify'; 


type ConfigType<VariableType extends {}> = {
    key: string;
    query: string;
    variables?: VariableType;
  };
  
  export const useSubscription = <
    ItemType extends { id: string },
    VariablesType extends {} = {}
  >({
    config,
    itemData,
  }: {
    config?: ConfigType<VariablesType>;
    itemData?: ItemType;
  } = {}) => {
    const [item, update] = useState<ItemType | undefined>(itemData);
  
    useEffect(() => {
      let unsubscribe;
      console.log('running useffect')
      if (config) {

        const { query, key, variables } = config;
        const subscription = API.graphql(graphqlOperation(query, variables));
          //@ts-ignore
          const sub = subscription.subscribe({
            next: (payload: any) => {
              try {
                const { value: { data: { [key]: item } } }: { value: { data: { [key: string]: ItemType } } } = payload;
                update(item);
              } catch (error) {
                console.error(
                  `${error.message} - Check the key property: the current value is ${key}`
                );
              }
            },
          });
          unsubscribe = () => {
            sub.unsubscribe();
          };
        
      }
      return unsubscribe;
      // eslint-disable-next-line 
    }, [JSON.stringify(config)]);
  
    return [item];
  };