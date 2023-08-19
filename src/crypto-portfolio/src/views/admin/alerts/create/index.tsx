import { Box, Button, Flex, FormLabel, Input, Select, Switch, Text, useColorModeValue } from "@chakra-ui/react";
import BreadCrumpStrip from "components/breadcrumb/Breadcrumb";
import { links } from "helpers/links";
import Card from "components/card/Card";
import InputField from "components/fields/InputField";
import TextFiled from "components/fields/TextField";
import SwitchField from "components/fields/SwitchField";
import { useState, useEffect } from "react";
import { BullFolio } from "bullfolio-types";
import { useCoins } from "contexts/CoinsContext";
import Loading from "components/Loading/Loading";
import { useUser } from "contexts/UserContext";
import { useAlerts } from "contexts/AlertsContext";

const CreateAlertPage = () => {

  const textColor = useColorModeValue("navy.700", "white");

  const { getAllCoins } = useCoins();
  const { createAlert } = useAlerts();

  const [coins, setCoins] = useState<BullFolio.CoinData[]>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<BullFolio.Alert>({
    id: "",
    name: "",
    description: "",
    strategy: null,
    active: true,
    condition: {
      strategy_event: "",
      type: "value_reached",
      value_reached: {
        key: "ath",
        value: 0,
      }
    },
    recurring: true,
    userUid: "",
    event: {
      data: "",
      description: "",
      name: "",
    },
    tokens: {
      type: "value",
      top: 0,
      array: [],
      value: null
    },
  });

  const CONDITION_TYPES: BullFolio.Strategy.Event.Condition.ConditionType[] = ["<", "<=", "==", ">", ">="];
  const KEYS: BullFolio.Strategy.Event.Condition.ConditionType[] = ["<", "<=", "==", ">", ">="];

  const handleCreate = async () => {
    setIsLoading(true);
    console.log(alert);
    await createAlert(alert);
    setIsLoading(false);
  }

  const handleEditCoin = (id: string) => {
    const prev = {...alert};
    prev.tokens.array = [id];
    setAlert(prev);
  }

  const handleEditValueKey = (id: string) => {
    const prev = {...alert};
    prev.tokens.value.key = id as BullFolio.Alert.AllowedKeys;
    setAlert(prev);
  }

  const handleEditValueCondition = (id: string) => {
    const prev = {...alert};
    prev.tokens.value.condition = id as BullFolio.Strategy.Event.Condition.ConditionType;
    setAlert(prev);
  }

  const handleEditValueValue = (id: string) => {
    const prev = {...alert};
    prev.tokens.value.value = Number(id);
    setAlert(prev);
  }

  const handleConditionValueKey = (id: string) => {
    const prev = {...alert};
    prev.condition.value_reached.key = id as BullFolio.Alert.AllowedKeys;
    setAlert(prev);
  }

  const handleConditionValueValue = (id: string) => {
    const prev = {...alert};
    prev.condition.value_reached.value = Number(id);
    setAlert(prev);
  }


  useEffect(() => {
    (async () => {
      const _coins = await getAllCoins(1);
      setCoins(_coins);
    })();
  }, []);

  return(
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <BreadCrumpStrip
        links={[{
          href: `/#${links.myAlerts}`,
          name: "My Alerts"
        }, {
          href: `/`,
          name: "Create"
        }]}
        additional={{ mb: "4" }}
      />
      <Card>
        <Text color={textColor} fontSize="xl" fontWeight={"900"} px="1" mb="3">
          Create Alert
        </Text>
        {!isLoading ? (
          <>
            <InputField
              label="Name"
              placeholder="My alert"
              mb="10px"
              value={alert.name}
              onChange={(e: any) => setAlert({...alert, name: e.target.value})}
            />
            <TextFiled
              label="Description"
              placeholder="Your short description"
              mb="6"
              value={alert.description}
              onChange={(e: any) => setAlert({...alert, description: e.target.value})}
            />
            <SwitchField
              id="type"
              label="One Time Alert (you only get one notification - then alert is deleted)"
              reversed={true}
              onClick={() => setAlert({...alert, recurring: !alert.recurring})}
            />
            <SwitchField
              id="strategy"
              label="Use Strategy Events for Alerts notifications"
              reversed={true}
              onClick={() => setAlert({...alert, strategy: { strategyId: "", events: [] }})}
            />
            <Box mt="6">
              <Text fontWeight={"extrabold"}>
                Tokens you want to be notified about
              </Text>
              {coins ? (
                <>
                  <Flex mt="3">
                    <Switch
                      id="array"
                      mt="0.5"
                      isChecked={alert.tokens.type === "array"}
                      onChange={() => {
                        const prev = {...alert};
                        if(alert.tokens.type === "value" || alert.tokens.type === "top") {
                          console.log("in if")
                          prev.tokens.value = null;
                          prev.tokens.type = "array";
                        }else{
                          console.log("in else")
                          prev.tokens.type = "top"
                          prev.tokens.value = null;
                        }
                        setAlert(prev);
                      }}
                    />
                    <FormLabel htmlFor='isDisabled' ml="3">Individual Coin:</FormLabel>
                  </Flex>
                  <Flex>
                    <Switch
                      id="metrics"
                      mt="0.5"
                      isChecked={alert.tokens.type === "value"}
                      onChange={() => {
                        const prev = {...alert};
                        if(alert.tokens.type === "array" || alert.tokens.type === "top") {
                          console.log("in if")
                          prev.tokens.value = {
                            key: "ath",
                            value: 0,
                            condition: "=="
                          }
                          prev.tokens.type = "value";
                        }else{
                          console.log("in else")
                          prev.tokens.type = "array"
                          prev.tokens.value = null;
                        }
                        setAlert(prev);
                      }}
                    />
                    <FormLabel htmlFor='isDisabled' ml="3">Select By Metric (eg. all tokens with market cap above $100m, ...):</FormLabel>
                  </Flex>
                  <Flex>
                    <Switch
                      id="top"
                      mt="0.5"
                      isChecked={alert.tokens.type === "top"}
                      onChange={() => {
                        const prev = {...alert};
                        if(alert.tokens.type === "array" || alert.tokens.type === "value") {
                          console.log("in if")
                          prev.tokens.value = null;
                          prev.tokens.type = "top";
                        }else{
                          console.log("in else")
                          prev.tokens.type = "array"
                          prev.tokens.value = null;
                        }
                        setAlert(prev);
                      }}
                    />
                    <FormLabel htmlFor='isDisabled' ml="3">Use Top Coins (eg. top 10 coins):</FormLabel>
                  </Flex>
                  {alert.tokens.type === "array" ? (
                    <Select onChange={(e) => handleEditCoin(e.target.value)}>
                      {coins.map(coin => {
                        return(
                          <option key={coin.id} value={coin.id}>{coin.name} ({coin.symbol.toUpperCase()})</option>
                        )
                      })}
                    </Select>
                  ):null}
                  {alert.tokens.type === "value" ? (
                    <Flex>
                      <Select onChange={(e) => handleEditValueKey(e.target.value)}>
                        {Object.keys(coins[0]).map(key => {
                          return(
                            <option key={key} value={key}>{key}</option>
                            )
                          })}
                      </Select>
                      <Select onChange={(e) => handleEditValueCondition(e.target.value)}>
                        {CONDITION_TYPES.map(val => {
                          return(
                            <option key={val} value={val}>{val}</option>
                            )
                          })}
                      </Select>
                      <Input
                        placeholder="Value"
                        value={alert.tokens.value?.value || ""}
                        onChange={(e) => handleEditValueValue(e.target.value)}
                      />
                    </Flex>
                  ):null}
                  {alert.tokens.type === "top" ? (
                    <Box>
                      <InputField
                        placeholder="20"
                        label="How Many Top Coins"
                      />
                    </Box>
                  ):null}
                </>
              ):(
                <Loading text="Loading Tokens..." />
              )}
            </Box>
            <Box mt="6">
              <Text fontWeight={"extrabold"}>
                Alert Me When Reaches:
              </Text>
              {coins ? (
                <Flex>
                  <Select onChange={(e) => handleConditionValueKey(e.target.value)}>
                    {Object.keys(coins[0]).map(key => {
                      return(
                        <option key={key} value={key}>{key}</option>
                        )
                      })}
                  </Select>
                  <Input
                    placeholder="Value"
                    value={alert.condition?.value_reached?.value || ""}
                    onChange={(e) => handleConditionValueValue(e.target.value)}
                  />
                </Flex>
              ):(
                <Loading text="Loading Coin..." />
              )}
            </Box>
          </>
        ):(
          <Loading text="Saving your alert..." />
        )}

        <Button width={"100%"} mt="8" variant={"darkBrand"} onClick={handleCreate}>
          Create
        </Button>
      </Card>
    </Box>
  );
};

export default CreateAlertPage;