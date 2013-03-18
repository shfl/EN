$(document).ready(function()
{
    var markers = [];
    var mapObj;
    var crossroads = {};
    var streets = $('ul.secondary-list>li');
    $('.search-form').submit(function()
    {
        var search = $('.search-field').val();
        if(search == '')
        {
            $('.street-elem').show();
        }
        else
        {
            $('.street-elem').each(function()
            {
                if ($(this).find('a').hasClass('on-map'))
                    return true;
                    
                var i = $(this).text().search(new RegExp(search, "i"))
                if(i == -1)
                    $(this).hide();
                else
                    $(this).show();
            });
        }
        return false;
    });
    
    $('.street-input').keyup(search);
    
    function search()
    {
        var search = $('.street-input').val();
        if(search.length < 3)
        {
            $('ul.secondary-list>li').show();
        }
        else
        {
            //$('.street-elem').each(function()
            streets.each(function()
            {
                var i = $(this).attr('data-title').search(new RegExp(search, "i"));
                if(i == -1)
                    $(this).hide();
                else
                    $(this).show();
            });
        }
        return false;
    }
        
    $('.street-elem').click(function()
    {
        var id = $(this).attr('data-id');
        $('.street-elem').removeClass('on-map');
        clearMarkers();
        addMarker($(this));
        clearCrossroads(); 
        var streetCrossroads = $(this).find('ul>li');
        if(streetCrossroads.length > 0)
        {
            streetCrossroads.each(function()
            {
                addCrossroad($(this).attr('data-id'), $(this).attr('data-title'), $(this).attr('data-lat'), $(this).attr('data-lng'));
            });
        }
        
        return false;
    });
    mapInit();
        
    function addMarker(link)
    {
        var id = link.attr('data-id');
        var lat = link.attr('data-lat');
        var lng = link.attr('data-lng');
        var title = link.text();
            
        var latLng = new google.maps.LatLng(lat,lng);
  		var pointTitle = 'title';
    		
  		var marker = new google.maps.Marker(
  		{
 			position: latLng,
 			map: mapObj,
 			title: title
  		});
        mapObj.panTo(latLng);
        mapObj.setZoom(15);
        markers[id] = marker;
        link.addClass('on-map');
    }
        
    function removeMarker(link)
    {
        var id = link.attr('data-id');
            
        markers[id].setMap(null);
        delete markers[id];
        link.removeClass('on-map');
        var latLng = new google.maps.LatLng(50.447913, 30.523109);
        mapObj.panTo(latLng);
        mapObj.setZoom(11);
    }
    
    function clearMarkers()
    {
        for(id in markers)
        {
            markers[id].setMap(null);
            delete(markers[id])
        }
    }
        
    function mapInit()
    {
        var mapOptions = {
 			center: new google.maps.LatLng(50.447913, 30.523109),
 			zoom: 11,
 			mapTypeId: google.maps.MapTypeId.ROADMAP
  		};
  		mapObj = new google.maps.Map(document.getElementById('map'), mapOptions);
        google.maps.event.addListener(mapObj, 'rightclick', function(event)
        {
            getCoords(event.latLng);
        });
    }
    
    function getCoords(coords)
    {
        var lat = coords.mb.toString().substring(0, 9);
        var lng = coords.nb.toString().substring(0, 9);
        
        $('form.coords-selection .latitude').val(lat);
        $('form.coords-selection .longtitude').val(lng);
        
        $('form.coords-selection .icon-ban-circle').removeClass('icon-ban-circle').addClass('icon-map-marker');
        $('form.coords-selection').removeClass('coords-selection');
    }
    
    function addCrossroad(id, title, lat, lng)
    {            
        if(crossroads[id])
            return false;
        else
            crossroads[id] = {};
            
        $('.crossroads .alert-main-street').hide();
        $('.crossroads .save-crossroads').before('<form class="form-inline"><b>'+title+'</b><i class="icon-remove remove-crossroad" data-id="'+id+'"></i><br /><input type="text" class="input-small latitude" placeholder="Latitude" value="'+lat+'">&nbsp;<input type="text" class="input-small longtitude" placeholder="Longtitude" value="'+lng+'">&nbsp;<i class="icon-map-marker define-coords"></i><input type="hidden" value="'+id+'" class="street-id" /><input type="hidden" value="'+title+'" class="street-title" /></form>');
        $('.crossroads .save-crossroads').show();
    }
    
    function clearCrossroads()
    {
        crossroads = {};
        $('.crossroads form').remove();
        $('.save-crossroads').hide();
    }
    
    $('ul.secondary-list button').click(function()
    {
        $(this).toggleClass('btn-success').siblings('ul').slideToggle();
    });
    
    $('.add-crossroad').click(function()
    {
        var mainStreetId = $('.on-map').attr('data-id');
        if(!mainStreetId)
            $('.crossroads .alert-main-street').show();
        else
        {
            var crossroadTitle = $(this).parent('li').text();
            var crossroadId = $(this).attr('data-id');
            
            addCrossroad(crossroadId, crossroadTitle, '', '');
        }
        return false;
    });
    
    $(document).on('click', '.icon-map-marker', function()
    {
        $('form.coords-selection .icon-ban-circle').removeClass('icon-ban-circle').addClass('icon-map-marker');
        $('form.coords-selection').removeClass('coords-selection');
        
        $(this).removeClass('icon-map-marker').addClass('icon-ban-circle');
        $(this).parents('form').addClass('coords-selection');
    });
    
    $(document).on('click', '.icon-ban-circle', function()
    {
        $(this).removeClass('icon-ban-circle').addClass('icon-map-marker');
        $(this).parents('form').removeClass('coords-selection');
    });
    
    $(document).on('click', '.remove-crossroad', function()
    {
        var crossroadId = $(this).attr('data-id');
        $(this).parents('form').remove();
        delete(crossroads[crossroadId]);
        if(Object.keys(crossroads).length == 0)
            $('.crossroads .save-crossroads').hide();
        return false;
    });
    
    $('.save-crossroads').on('click',function()
    {
        var mainStreetId = $('.on-map').attr('data-id');
        $('.crossroads form').each(function()
        {
            var secondaryStreetId = $(this).find('.street-id').val();
            var secondaryStreetTitle = $(this).find('.street-title').val();
            var secondaryStreetLat = $(this).find('.latitude').val();
            var secondaryStreetLng = $(this).find('.longtitude').val();
            crossroads[secondaryStreetId] = {
                id: secondaryStreetId,
                title: secondaryStreetTitle,
                lat: secondaryStreetLat,
                lng: secondaryStreetLng
            };
        });
        $.ajax(
        {
            url: 'ajax/addCrossroads.php',
            type: 'post',
            dataType: 'json',
            data: {crossroads: crossroads, main_street_id: mainStreetId},
            complete: function(data)
            {
                $('.crossroads .alert-saved').show();
                $('.on-map .crossroads-expand').removeClass('icon-chevron-down');
                $('.on-map .crossroads-expand').addClass('crossroads-expand-active').addClass('icon-chevron-right');
                var crossroadsList = '';
                for(streetId in crossroads)
                {
                    crossroadsList += '<li>'+crossroads[streetId].title+'</li>';
                }
                $('.on-map ul').remove();
                $('.on-map').append('<ul>'+crossroadsList+'</ul>');
            }
        });
    });
    
    $('.crossroads-expand-active').click(function()
    {
        $(this).toggleClass('icon-chevron-right').toggleClass('icon-chevron-down');
        $(this).siblings('ul').slideToggle();
        return false;
    });
    
    $(document).on('click', '.clear-crossroads', function()
    {
        $('.crossroads .alert-saved').hide();
        $('.save-crossroads').hide();
        $('.street-input').val('');
        $('ul.secondary-list>li').show();
        $('.on-map .crossroads-expand').removeClass('icon-chevron-down').addClass('icon-chevron-right');
        $('.on-map ul').hide();
        $('.on-map').removeClass('on-map');
        clearMarkers();
        clearCrossroads();
        return false;
    });
});