<template>
  <div class="w-full">
    <!-- form container -->
    <form>
      <div
        v-for="(row, index) in rows"
        :key="index"
        class="flex items-center w-full gap-4 mb-12"
      >
        <!-- region form control -->
        <div class="relative flex flex-col w-full">
          <label for="regions" class="base-label">Viloyat</label>
          <select
            id="regions"
            v-model="row.region"
            @change="fetchDistricts(index)"
            class="base-select"
          >
            <option v-for="region in regions" :key="region.id" :value="region">
              {{ region.name }}
            </option>
          </select>
        </div>

        <!-- districts form control -->
        <div class="relative flex flex-col w-full">
          <label for="districts" class="base-label">Tuman</label>
          <select v-model="row.district" id="districts" class="base-select">
            <option
              v-for="(district, districtIndex) in filteredDistricts(index)"
              :key="districtIndex"
              :value="district"
            >
              {{ district.name }}
            </option>
          </select>
        </div>

        <!-- comments form control -->
        <div class="relative flex flex-col w-full">
          <label for="comment" class="base-label">Comment</label>
          <input
            v-model="row.comment"
            type="email"
            class="base-input"
            id="comment"
            placeholder="Enter comment"
          />
        </div>

        <!-- actions button -->
        <div class="relative flex flex-col mt-[30px]">
          <button @click.prevent="removeRow(index)" class="btn-danger">
            Delete
          </button>
        </div>
      </div>

      <button @click.prevent="addRow" class="btn-primary">Add+</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import FormData from "../types/FormData";
import { District, Region } from "../types/Location";

const rows = ref<FormData[]>([{ region: null, district: null, comment: "" }]);

const regions = ref<Region[]>([]);
const districts = ref<District[][]>([]);
const error = ref<unknown>(null);

const filteredDistricts = computed(() => {
  return (index: number) => {
    const selectedDistrictIds = rows.value
      .flatMap((item) => item.district?.id ?? [])
      .filter((d) => d !== rows.value[index].district?.id);

    return districts.value[index]?.filter(
      (r) => !selectedDistrictIds.includes(r.id)
    );
  };
});

const addRow = () => {
  rows.value.push({ region: null, district: null, comment: "" });
};

const removeRow = (index: number) => {
  rows.value.splice(index, 1);
};

const fetchRegions = async () => {
  try {
    const response = await axios.get("https://robocontest.uz/api/regions");
    regions.value = response.data;
  } catch (err) {
    error.value = err;
  }
};

const fetchDistricts = async (index: number) => {
  const regionId = rows.value[index].region?.id;
  try {
    const response = await axios.get(
      `https://robocontest.uz/api/regions?q=${regionId}`
    );
    districts.value[index] = response.data;
  } catch (err) {
    error.value = err;
  }
};

onMounted(fetchRegions);
</script>
