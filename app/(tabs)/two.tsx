import { ScrollView, View, StyleSheet } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { Chip } from 'react-native-paper';
import StoreContext from '../../contexts/Store';
import { Allergen } from '../../types';

const allergenToString = (arr: Allergen[]) => {
  const formattedAllergens = arr.map((allergen) => allergen.value);
  return formattedAllergens;
};

const stringToAllergen = (arr: string[]) => {
  const formattedAllergens = arr.map((allergen) => {
    return {
      label: allergen,
      value: allergen,
    };
  });
  return formattedAllergens;
};

export default function TabTwoScreen() {
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const { user, patchUserAllergens } = useContext(StoreContext);
  const [selectedItems, setSelectedItems] = useState<Allergen[]>([]);

  useEffect(() => {
    fetchAllergens();
    if (user) {
      const formattedAllergens = stringToAllergen(user.allergens);
      setSelectedItems(formattedAllergens);
    }
  }, []);

  useEffect(() => {
    const newArr = allergenToString(selectedItems);
    patchUserAllergens(newArr);
  }, [selectedItems]);

  const handleSelectedAllergens = (item: Allergen) => {
    delete item._index;
    if (!JSON.stringify(selectedItems).includes(JSON.stringify(item))) {
      setSelectedItems([
        ...selectedItems,
        { label: item.label, value: item.value },
      ]);
    }
  };

  const handleChipClick = async (item: Allergen) => {
    const newArr = selectedItems.filter(
      (allergen) => allergen.label !== item.label
    );
    setSelectedItems(newArr);
  };

  const fetchAllergens = async () => {
    try {
      const productResult = await fetch(
        `http://192.168.101.237:8000/api/allergens`
      );
      const fetchData = await productResult.json();
      const formattedAllergens = stringToAllergen(fetchData);
      setAllergens(formattedAllergens);
    } catch (error) {
      console.log('failed to fetch');
      console.log(error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollView}>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={allergens}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        searchPlaceholder="Search..."
        onChange={handleSelectedAllergens}
      />
      <View style={styles.chipContainer}>
        {selectedItems?.map((item, index) => (
          <Chip
            key={index}
            icon="information"
            style={styles.chip}
            onPress={() => handleChipClick(item)}>
            {item.label}
          </Chip>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  dropdown: {
    height: 50,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  chipContainer: {
    width: '100%',
    gap: 20,
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20,
  },
  chip: {
    flexShrink: 1,
  },
});
