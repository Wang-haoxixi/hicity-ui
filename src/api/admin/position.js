import request from "@/router/axios";

const prefixUrl = "/admin/position";
/**
 * 分类树
 * @param params (无意义)
 */
export const getPositionTree = (params) => {
  return request({
    url: `${prefixUrl}/search_similar_name`,
    method: "get",
    params,
  });
};
/**
 * 新增分类
 * @param data 分类DTO
 */
export const addPosition = (data) => {
  return request({
    url: `${prefixUrl}/admin_create`,
    method: "post",
    data,
  });
};
/**
 * 修改分类
 * @param data 分类DTO
 */
export const updatePosition = (data) => {
  return request({
    url: `${prefixUrl}/update`,
    method: "post",
    data,
  });
};
/**
 * 删除分类
 * @param id 分类ID
 */
export const delPositionById = (id) => {
  return request({
    url: `${prefixUrl}/delete`,
    method: "post",
    data: [id]
  });
};
/**
 * 通过编码获取
 * @param number 分类编码
 */
export const getPositionTreeByNumber = (number, params) => {
  return request({
    url: `${prefixUrl}/children/${number}`,
    method: "get",
    params,
  });
};
