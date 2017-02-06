export default function($sce){
  return function(input){
    return $sce.trustAsHtml(input);
  }
}