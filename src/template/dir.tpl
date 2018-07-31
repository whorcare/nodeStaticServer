<!DOCTYPE html>
<html>
<head>
	<title></title>
	<style type="text/css">
		body {
			margin: 30px;
		}
	</style>
</head>
<body>
	{{#each files}}
		<a href="{{../dir}}/{{file}}">[{{icon}}]{{file}}</a>
	{{/each}}
</body>
</html>