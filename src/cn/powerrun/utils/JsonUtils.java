package cn.powerrun.utils;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


/**
 * 
 * @author ZlotCheng
 *
 */
public class JsonUtils {
	
	//输入一个json文件，输出一个处理过后的JSONObject
	public static String FileToJson(File file) {
		String content = "";
		try {
			content = FileUtils.readFileToString(file,"UTF-8");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		JSONObject jsonObject = new JSONObject(content);
		JSONArray jsonArray = JsonUtils.jsonToArr(jsonObject.get("head").toString());
		
		JSONObject baseInfo = new JSONObject();
		baseInfo.put("name", jsonObject.get("name"));
		JSONObject taiQuMapInfo = (JSONObject) jsonObject.get("taiQuMapInfo");
		
		baseInfo.put("transformX", taiQuMapInfo.get("transformX"));
		baseInfo.put("transformY", taiQuMapInfo.get("transformY"));
		
		JSONObject result = new JSONObject();
		result.put("baseInfo", baseInfo);
		result.put("jsonArray", jsonArray);
		JsonUtils.magnifyCoordinate(result);
		return result.toString();
	}
	
	
	public static JSONArray jsonToArr(String json) {
		JSONArray result = new JSONArray();
		JSONObject jsonObject = new JSONObject(json);

		getJSONObject(result, jsonObject);

		return result;

	}

	public static void getJSONObject(JSONArray jsonArray, JSONObject jsonObject) {
		JSONObject temp = new JSONObject();
		temp.put("vnodekind", getValueByKeyFilterTheNull(jsonObject, "vnodekind"));

		if (!jsonObject.get("vnodekind").equals("headnode")) {

			temp.put("vnodeName", getValueByKeyFilterTheNull(jsonObject, "vnodeName"));
			temp.put("serNo", getValueByKeyFilterTheNull(jsonObject, "serNo"));
			temp.put("level", getValueByKeyFilterTheNull(jsonObject, "level"));

			temp.put("phase", getValueByKeyFilterTheNull(jsonObject, "phase"));
			
			temp.put("wireName", getValueByKeyFilterTheNull(jsonObject, "wireName"));
			temp.put("material", getValueByKeyFilterTheNull(jsonObject, "material"));
			temp.put("wireLength", getValueByKeyFilterTheNull(jsonObject, "wireLength"));

			// 这两个不做判空
			temp.put("cartesian", ((JSONObject) jsonObject.get("myCoSys")).get("cartesian"));
			temp.put("father_location", getValueByKeyFilterTheNull(jsonObject, "father_location"));
			temp.put("original", ((JSONObject) jsonObject.get("myCoSys")).get("original"));
			if (jsonObject.get("vnodekind").equals("T")) {
				temp.put("jointresistance", getValueByKeyFilterTheNull(jsonObject, "jointresistance"));
				temp.put("branchCount", getValueByKeyFilterTheNull(jsonObject, "branchCount"));
				temp.put("csArea", getValueByKeyFilterTheNull(jsonObject, "csArea"));
			} else if (jsonObject.get("vnodekind").equals("transformer")) {
				temp.put("outVoltage", getValueByKeyFilterTheNull(jsonObject, "outVoltage"));
				temp.put("capacity", getValueByKeyFilterTheNull(jsonObject, "capacity"));
				temp.put("branchCount", getValueByKeyFilterTheNull(jsonObject, "branchCount"));
				temp.put("csArea", getValueByKeyFilterTheNull(jsonObject, "csArea"));
			} else if (jsonObject.get("vnodekind").equals("user")) {
				temp.put("id", getValueByKeyFilterTheNull(jsonObject, "id"));
				temp.put("assetNumber",  getValueByKeyFilterTheNull(jsonObject, "assetNumber"));
				temp.put("userName",  getValueByKeyFilterTheNull(jsonObject, "userName"));
				temp.put("csArea", getValueByKeyFilterTheNull(jsonObject, "csArea"));
			}
			jsonArray.put(temp);

		}
		JSONArray son_node_list = jsonObject.getJSONArray("son_node_list");
		for (Object object : son_node_list) {
			JSONObject myJSONObject = (JSONObject) object;
			if (!jsonObject.get("vnodekind").equals("headnode")) {
				myJSONObject.put("father_location", ((JSONObject) jsonObject.get("myCoSys")).get("cartesian"));
			}

			getJSONObject(jsonArray, myJSONObject);
		}

	}

	public static Object getValueByKeyFilterTheNull(JSONObject jsonObject, String key) {
		return jsonObject.has(key) ? jsonObject.get(key) : "";
	}

	
	public static void magnifyCoordinate(JSONObject jsonObject) {
		JSONArray jsonArray = (JSONArray) jsonObject.get("jsonArray");
		for(int i=0;i<jsonArray.length();i++) {
			JSONObject temp = (JSONObject) jsonArray.get(i);
			JSONArray myArray =  (JSONArray) temp.get("cartesian");
			myArray.put(0, myArray.getInt(0) * 1);
			myArray.put(1, myArray.getInt(1) * 1);
		}
	}
}
