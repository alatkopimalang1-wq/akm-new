@php
    $metaPixelId = config('services.meta_pixel.id');
@endphp

@if(!empty($metaPixelId))
<!-- Meta Pixel Code (Deferred for Mobile Performance) -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];
function loadFb(){
    if(n.scriptLoaded)return;n.scriptLoaded=true;
    t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s);
}
if('requestIdleCallback' in window){
    window.requestIdleCallback(function(){ setTimeout(loadFb, 1000); });
} else {
    window.addEventListener('load', function(){ setTimeout(loadFb, 1000); });
}
}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '{{ $metaPixelId }}');
fbq('track', 'PageView');
</script>
<noscript>
<img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id={{ $metaPixelId }}&ev=PageView&noscript=1"
alt=""
/>
</noscript>
<!-- End Meta Pixel Code -->
@endif

