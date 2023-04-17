package ru.academits.coverter;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.util.ArrayList;
import java.util.Arrays;

public class ListConverter {
    private Gson gson = new GsonBuilder().create();

    public ArrayList<Integer> convertFormJson(String stringJson) {
        return new ArrayList<>(Arrays.asList(gson.fromJson(stringJson, Integer[].class)));
    }
}
