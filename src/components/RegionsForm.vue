<template>
  <div class="w-full">
    <form>
      <div
        v-for="(row, index) in rows"
        :key="index"
        class="flex items-center w-full gap-4 mb-12"
      >
        <div class="relative flex flex-col w-full">
          <label for="province" class="base-label">Viloyat</label>
          <select
            id="province"
            v-model="row.province"
            @change="onSelectChange(index)"
            class="base-select"
          >
            <option
              v-for="province in provinces"
              :key="province.id"
              :value="province"
            >
              {{ province.name }}
            </option>
          </select>
        </div>
        <div class="relative flex flex-col w-full">
          <label for="regions" class="base-label">Tuman</label>
          <select v-model="row.region" id="regions" class="base-select">
            <option
              v-for="(region, regionIndex) in filteredRegions(index)"
              :key="regionIndex"
              :value="region"
            >
              {{ region.name }}
            </option>
          </select>
        </div>
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
import Region from "../types/Region";
import Province from "../types/Province";
import FormData from "../types/FormData";

const rows = ref<FormData[]>([{ province: null, region: null, comment: "" }]);

const provinces = ref<Province[]>([]);
const regions = ref<Region[][]>([]);
const error = ref<unknown>(null);
const selectedRegions = ref<number[]>([]);

const filteredRegions = computed(() => {
  return (index: number) => {
    let selectedRegionsIds = selectedRegions.value.filter(
      (r) => r !== rows.value[index].region?.id
    );
    return regions.value[index]?.filter(
      (r) => !selectedRegionsIds.includes(r.id)
    );
  };
});

const addRow = () => {
  rows.value.push({ province: null, region: null, comment: "" });
  selectedRegions.value = rows.value.flatMap((item) =>
    typeof item.region?.id === "number" ? [item.region.id] : []
  );
};

const removeRow = (index: number) => {
  rows.value.splice(index, 1);
};

const fetchData = async () => {
  try {
    const response = await axios.get("https://robocontest.uz/api/regions");
    provinces.value = response.data;
  } catch (err) {
    error.value = err;
  }
};

const onSelectChange = async (index: number) => {
  const provinceId = rows.value[index].province?.id;
  try {
    const response = await axios.get(
      `https://robocontest.uz/api/regions?q=${provinceId}`
    );
    regions.value[index] = response.data;
  } catch (err) {
    error.value = err;
  }
};

onMounted(fetchData);
</script>
